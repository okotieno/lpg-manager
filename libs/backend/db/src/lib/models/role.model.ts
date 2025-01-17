import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { PermissionModel } from './permission.model';
import { UserModel } from './user.model';

@Table({
  tableName: 'roles',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
  indexes: [
    {
      unique: true,
      fields: ['name'],
      where: {
        deleted_at: null,
      },
      name: 'roles_name_unique_not_deleted',
    },
  ],
})
export class RoleModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  override id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'roles_name_unique_not_deleted',
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  label!: string;

  @BelongsToMany(() => PermissionModel, {
    foreignKeyConstraint: true,
    through: 'permission_role',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
  })
  permissions!: PermissionModel[];

  @BelongsToMany(() => UserModel, {
    foreignKeyConstraint: true,
    through: 'role_user',
    foreignKey: 'role_id',
    otherKey: 'user_id',
  })
  users!: UserModel[];
}
