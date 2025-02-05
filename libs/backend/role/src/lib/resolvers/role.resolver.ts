import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateRoleInputDto } from '../dto/create-role-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
} from '@lpg-manager/permission-service';
import { IPermissionEnum } from '@lpg-manager/types';
import { RoleService } from '@lpg-manager/role-service';
import { IQueryParam, PermissionModel, RoleModel } from '@lpg-manager/db';
import { UpdateRoleInputDto } from '../dto/update-role-input.dto';

@Resolver(() => RoleModel)
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.CreateRole)
  async createRole(
    @Body('params', new ValidationPipe()) input: CreateRoleInputDto
  ) {
    const role = await this.roleService.create({
      ...input,
    });
    return {
      message: 'Successfully created role',
      data: role,
    };
  }

  @Query(() => RoleModel)
  roles(@Args('query') query: IQueryParam) {
    return this.roleService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => RoleModel)
  async role(@Args('id') id: string) {
    return this.roleService.findById(id);
  }

  @ResolveField()
  async permissions(@Parent() roleModel: RoleModel) {
    const rolePermissions = await this.roleService.findById(roleModel.id, {
      include: [PermissionModel],
    });
    return rolePermissions ? rolePermissions.permissions : [];
  }

  @Mutation(() => RoleModel)
  async deleteRole(@Args('id') id: string) {
    await this.roleService.deleteById(id);

    return {
      message: 'Successfully deleted role',
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.UpdateRole)
  async updateRole(
    @Body(new ValidationPipe()) { id, params }: UpdateRoleInputDto
  ) {
    const role = await this.roleService.update({
      id,
      params,
    });

    return {
      message: 'Successfully updated role',
      data: role,
    };
  }
}
