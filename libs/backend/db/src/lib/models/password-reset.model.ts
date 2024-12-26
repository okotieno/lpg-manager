import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'password_resets',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class PasswordResetModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true
  })
  override id!: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false
  })
  userId?: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  token?: string;

  @Column({ type: DataTypes.DATE, allowNull: false })
  expiresAt?: Date;
}
