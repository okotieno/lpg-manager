import { Column, ForeignKey, Model, Table, BelongsTo } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { RoleModel } from './role.model';
import { StationModel } from './station.model';
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
  @Column({ type: DataTypes.UUID, allowNull: false })
  userId!: string;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  roleId!: string;

  @BelongsTo(() => RoleModel)
  role!: RoleModel;

  @ForeignKey(() => StationModel)
  @Column({ type: DataTypes.UUID, allowNull: true })
  stationId!: string;

  @BelongsTo(() => StationModel)
  station!: StationModel;
}
