import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
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
  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false
  })
  userId?: number; // or userId if you prefer to use user ID instead

  @Column({ type: DataTypes.STRING, allowNull: false })
  token?: string;

  @Column({ type: DataTypes.DATE, allowNull: false })
  expiresAt?: Date;
}
