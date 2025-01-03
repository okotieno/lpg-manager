import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from '@lpg-manager/user-service';
import { CreateUserInputDto } from '../dto/create-user-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created.event';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import {
  IQueryParam,
  RoleModel,
  RoleUserModel,
  StationModel,
  UserModel,
} from '@lpg-manager/db';
import { UpdateUserInputDto } from '../dto/update-user-input.dto';
import { UserUpdatedEvent } from '../events/user-updated.event';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2
  ) {}

  @Query(() => UserModel)
  users(@Args('query') query: IQueryParam) {
    return this.userService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => UserModel)
  async user(@Args('id') id: string) {
    return this.userService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateUser)
  async createUser(
    @Body('params', new ValidationPipe()) params: CreateUserInputDto
  ) {
    const password = this.userService.generatePassword();
    const hashedPassword = await this.userService.hashPassword(password);

    const user = await this.userService.create({
      ...params,
      password: hashedPassword,
      username: params.email,
    });

    await this.userService.assignRoleToUser(user, params.roles);

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(user, password)
    );

    return {
      message: 'Successfully created user',
      data: user,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateUser)
  async updateUser(@Body(new ValidationPipe()) input: UpdateUserInputDto) {
    const user = await this.userService.findById(input.id);
    if (user) {
      await user?.update(input.params);
      await user?.save();

      await this.userService.assignRoleToUser(user, input.params.roles);

      this.eventEmitter.emit('user.updated', new UserUpdatedEvent(user));
      return {
        message: 'Successfully created user',
        data: user,
      };
    }
    throw new BadRequestException('No user found');
  }

  // @Mutation()
  // @UseGuards(JwtAuthGuard, PermissionGuard)
  // @Permissions(PermissionsEnum.AssignCountryToUser)
  // async assignCountriesLanguagesToUser(@Body(new ValidationPipe()) params: AssignCountryToUserInputDto) {
  //   await this.userService.assignCountriesLanguages(params)
  //   return {
  //     message: 'Successfully assigned user',
  //   }
  // }
  //
  // @Mutation()
  // @UseGuards(JwtAuthGuard, PermissionGuard)
  // @Permissions(PermissionsEnum.AllocateWarehouseToUser)
  // async allocateWarehouseToUser(@Body(new ValidationPipe()) params: AllocateWarehouseToUserInputDTO) {
  //   await this.userService.allocateWarehouse(params);
  //   return {
  //     message: 'Successfully assigned user',
  //   }
  // }

  @Query(() => UserModel)
  async userCount() {
    const count = await this.userService.model.count();
    return { count };
  }

  @ResolveField('roles')
  async getRoles(@Parent() user: UserModel) {
    const userWithRoles = await this.userService.findById(user.id, {
      include: [
        {
          model: RoleUserModel,
          include: [
            {
              model: RoleModel,
              attributes: ['id', 'name'],
            },
            {
              model: StationModel,
              attributes: ['id', 'name', 'type'],
            },
          ],
        },
      ],
    });
    return (
      userWithRoles?.roleUsers?.map((roleUser) => ({
        id: roleUser.id,
        role: roleUser.role,
        station: roleUser.station,
      })) || []
    );
  }
}
