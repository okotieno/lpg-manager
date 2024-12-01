import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { RoleModel } from './role.model';
import { DataTypes } from 'sequelize';

@Table({

  tableName: 'role_user',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false
})
export class RoleUserModel extends Model {
  @ForeignKey(() => UserModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  userId!: number;

  user!: UserModel

  @ForeignKey(() => RoleModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  roleId!: number;

  role!: RoleModel
}
