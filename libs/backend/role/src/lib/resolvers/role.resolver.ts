import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CreateRoleInputDto } from '../dto/create-role-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { PermissionGuard, Permissions, PermissionsEnum } from '@lpg-manager/permission-service';
import { RoleService } from '@lpg-manager/role-service';
import { IQueryParam, PermissionModel, RoleModel } from '@lpg-manager/db';

@Resolver(() => RoleModel)
export class RoleResolver {

  constructor(private roleService: RoleService) {
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateRole)
  async createRole(@Body('params', new ValidationPipe()) input: CreateRoleInputDto) {
    console.log(input);
    const role = await this.roleService.create({
      ...input
    });
    return {
      message: 'Successfully created role',
      data: role
    };
  }

  @Query(() => RoleModel)
  roles(
    @Args('query') query: IQueryParam
  ) {
    return this.roleService.findAll({
      ...query,
      filters: query?.filters ?? []
    });
  }

  @Query(() => RoleModel)
  async role(
    @Args('id') id: string
  ) {
    return this.roleService.findById(id);
  }

  @ResolveField()
  async permissions(@Parent() roleModel: RoleModel) {
    const rolePermissions = await this.roleService.findById(roleModel.id, { include: [PermissionModel] });
    return rolePermissions ? rolePermissions.permissions : [];
  }

  @Mutation(() => RoleModel)
  async deleteRole(
    @Args('id') id: number
  ) {
    await this.roleService.deleteById(id);

    return {
      message: 'Successfully deleted role'
    };
  }
}
