import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { PermissionModel, RoleModel, UserModel } from '@lpg-manager/db';
import { Op, WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { hash } from 'bcrypt';

@Injectable()
export class UserService extends CrudAbstractService<UserModel> {
  override globalSearchFields = ['firstName', 'lastName', 'email'];
  constructor(@InjectModel(UserModel) repository: typeof UserModel) {
    super(repository);
  }

  saltOrRounds = 10;

  async findByEmail(
    email: string,
    whereOptions?: WhereOptions<UserModel>,
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
      [] as PermissionModel[],
    );

    return Array.from(new Set(permissions)); // Remove duplicates
  }

  async findByUsernameEmailPhone(
    usernameOrEmailOrPhone: string,
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
}
