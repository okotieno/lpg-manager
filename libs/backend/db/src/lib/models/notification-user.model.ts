import {
  Column,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { NotificationModel } from './notification.model';
import { UserModel } from './user.model';

@Table({
  tableName: 'notification_user',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class NotificationUserModel extends Model {
  @ForeignKey(() => NotificationModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  notificationId!: number;

  @BelongsTo(() => NotificationModel)
  notification!: NotificationModel;

  @ForeignKey(() => UserModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  isRead?: boolean;
}
