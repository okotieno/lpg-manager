import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import {
  PermissionModel,
  RoleModel,
  RoleUserModel,
  UserModel,
  DriverModel,
} from '@lpg-manager/db';
import { Op, WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { hash } from 'bcrypt';
import { IDefaultRoles } from '@lpg-manager/types';

@Injectable()
export class UserService extends CrudAbstractService<UserModel> {
  override globalSearchFields = ['firstName', 'lastName', 'email'];

  constructor(
    @InjectModel(UserModel) repository: typeof UserModel,
    @InjectModel(RoleUserModel) private roleUserModel: typeof UserModel,
    @InjectModel(RoleModel) private roleModel: typeof RoleModel,
    @InjectModel(DriverModel) private driverModel: typeof DriverModel
  ) {
    super(repository);
  }

  saltOrRounds = 10;

  async findByEmail(
    email: string,
    whereOptions?: WhereOptions<UserModel>
  ): Promise<UserModel | null> {
    const where = { ...whereOptions, email };
    return this.repository.findOne({ where });
  }

  async getUserPermissions(email: string) {
    const user = await this.repository.findOne({
      where: { email },
      include: [
        {
          model: RoleModel,
          include: [PermissionModel],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Extract permissions from roles
    const permissions = user.roles?.reduce(
      (prev, { permissions }) => [...prev, ...permissions],
      [] as PermissionModel[]
    );

    return Array.from(new Set(permissions)); // Remove duplicates
  }

  async findByUsernameEmailPhone(
    usernameOrEmailOrPhone: string
  ): Promise<UserModel | null> {
    const where = {
      [Op.or]: [
        { email: usernameOrEmailOrPhone },
        { phone: usernameOrEmailOrPhone },
        { username: usernameOrEmailOrPhone },
      ],
    };

    return this.repository.findOne({ where });
  }

  generatePassword() {
    let pass = '';
    const str =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 8; i++) {
      const char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }
    return pass;
  }

  hashPassword = (password: string) => hash(password, this.saltOrRounds);

  async assignRoleToUser(
    user: UserModel,
    roles: {
      id: string;
      roleId: string;
      stationId?: string;
      transporterId?: string;
      licenseNumber?: string;
    }[]
  ) {
    // First remove all existing roles from the user
    await user.$set('roles', []);

    // Create role-user associations for each role
    for (const roleInput of roles) {
      // Create the role-user association
      await this.roleUserModel.create({
        id: roleInput.id,
        userId: user.id,
        roleId: roleInput.roleId,
        stationId: roleInput.stationId,
      });

      // If this is a driver role and we have transporter info, create driver record
      const role = await this.roleModel.findByPk(roleInput.roleId);
      if (
        role?.name === IDefaultRoles.Driver &&
        roleInput.transporterId &&
        roleInput.licenseNumber
      ) {
        // Check if driver record already exists
        let driver = await this.driverModel.findOne({
          where: { userId: user.id },
        });

        if (driver) {
          // Update existing driver
          await driver.update({
            transporterId: roleInput.transporterId,
            licenseNumber: roleInput.licenseNumber,
          });
        } else {
          // Create new driver record
          driver = await this.driverModel.create({
            userId: user.id,
            transporterId: roleInput.transporterId,
            licenseNumber: roleInput.licenseNumber,
          });
        }
      }
    }

    // Refresh the user instance to include new roles
    await user.reload({
      include: [
        {
          model: RoleModel,
          include: ['permissions'],
        },
        {
          model: DriverModel,
        },
      ],
    });

    return user;
  }
}
