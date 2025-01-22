import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { PermissionModel, RoleModel, RoleUserModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

interface CreateRoleInputDto {
  name: string;
  permissions?: { id: string }[];
}

@Injectable()
export class RoleService extends CrudAbstractService<RoleModel> {
  override globalSearchFields = ['name', 'label'];
  constructor(
    @InjectModel(RoleModel) private roleModel: typeof RoleModel,
    @InjectModel(RoleUserModel) private roleUserModel: typeof RoleUserModel
  ) {
    super(roleModel);
  }

  override async create(data: CreateRoleInputDto): Promise<RoleModel> {
    const role = await this.roleModel.create({ name: data.name });

    if (data.permissions?.length) {
      await this.assignPermissionsToRole(role.id, data.permissions);
    }

    return (await this.roleModel.findByPk(role.id, {
      include: [{ model: PermissionModel }],
    })) as RoleModel;
  }

  async assignPermissionsToRole(
    roleId: string,
    permissions: { id: string }[]
  ): Promise<void> {
    const role = await this.roleModel.findByPk(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    const permissionIds = permissions.map((p) => p.id).filter(Boolean);
    if (!permissionIds.length) {
      await role.$set('permissions', []);
      return;
    }

    const permissionsToAssign = await PermissionModel.findAll({
      where: { id: permissionIds },
    });

    if (permissionsToAssign.length !== permissionIds.length) {
      throw new Error('Some permissions were not found');
    }

    // Use $set instead of $remove and $add
    await role.$set('permissions', permissionsToAssign);
  }

  override async update({
    id,
    params,
  }: {
    id: string;
    params: CreateRoleInputDto;
  }): Promise<RoleModel> {
    const role = await this.roleModel.findByPk(id);
    if (!role) {
      throw new Error('Role not found');
    }

    await role.update({ name: params.name });

    if (params.permissions?.length) {
      await this.assignPermissionsToRole(role.id, params.permissions);
    } else {
      await role.$set('permissions', []);
    }

    return (await this.roleModel.findByPk(id, {
      include: [{ model: PermissionModel }],
    })) as RoleModel;
  }

  async getUserRoles(userId: string) {
    const userRoles = await this.roleUserModel.findAll({
      where: { userId },
      attributes: ['roleId'],
    });

    const roleIds = userRoles.map((ur) => ur.roleId);
    if (roleIds.length > 0) {
      return this.roleModel.findAll({
        where: {
          id: roleIds,
        },
        include: ['permissions'],
      });
    }
    return [];
  }

  async assignRoleToUser(userId: string, roleName: string): Promise<void> {
    const role = await this.roleModel.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    const roleId = role.id;

    // Check if the role is already assigned to the user
    const existingRole = await this.roleUserModel.findOne({
      where: { userId, roleId },
    });

    if (existingRole) {
      throw new Error('User already has this role');
    }

    // Assign the new role to the user
    await this.roleUserModel.create({
      userId,
      roleId,
    });
  }
}
