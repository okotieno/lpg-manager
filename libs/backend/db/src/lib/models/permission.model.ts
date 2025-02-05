import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { RoleModel } from './role.model';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'permissions',
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
      name: 'permissions_name_unique_not_deleted',
    },
  ],
})
export class PermissionModel extends Model {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'permissions_name_unique_not_deleted',
  })
  name!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  label!: string;

  @BelongsToMany(() => RoleModel, {
    foreignKeyConstraint: true,
    through: 'permission_role',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
  })
  roles!: RoleModel[];
}
