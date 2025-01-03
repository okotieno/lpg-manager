import { Mutation, Resolver } from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
  PermissionService,
} from '@lpg-manager/permission-service';
import { RoleService } from '@lpg-manager/role-service';
import { GivePermissionToRoleInputDto } from '../dto/give-permission-to-role-input.dto';
import {
  PermissionModel,
  RoleModel,
  RoleUserModel,
  UserModel,
} from '@lpg-manager/db';
import { AssignRoleToUserInputDto } from '../dto/assign-role-to-user-input.dto';
import { UserService } from '@lpg-manager/user-service';
import { InjectModel } from '@nestjs/sequelize';

@Resolver(() => RoleModel)
export class RolePermissionAssignmentResolver {
  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private userService: UserService,
    @InjectModel(RoleUserModel) private roleUserModel: typeof RoleUserModel
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.GivePermissionToRole)
  async givePermissionsToRole(
    @Body(new ValidationPipe()) input: GivePermissionToRoleInputDto
  ) {
    const role = (await this.roleService.findById(input.roleId)) as RoleModel;
    await role.$set('permissions', []);
    for (let i = 0; i < input.permissions.length; i++) {
      const permissionId = input.permissions[i].id;
      const permission = (await this.permissionService.findById(
        permissionId
      )) as PermissionModel;
      await role.$add('permissions', permission);
    }

    return {
      message: 'Successfully given permissions to role',
      data: role,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.AssignRoleToUser)
  async assignRoleToUser(
    @Body(new ValidationPipe()) input: AssignRoleToUserInputDto
  ) {
    const user = (await this.userService.findById(input.userId)) as UserModel;
    await user.$set('roles', []);

    for (const roleInput of input.roles) {
      const role = (await this.roleService.findById(roleInput.id)) as RoleModel;
      await this.roleUserModel.create({
        userId: user.id,
        roleId: role.id,
        stationId: roleInput.stationId,
      });
    }

    return {
      message: 'Successfully assigned role to user',
    };
  }
}
