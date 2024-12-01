import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'notifications',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class NotificationModel extends Model {
  @Column({ type: DataTypes.STRING, allowNull: false })
  title?: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  description?: string;
}
