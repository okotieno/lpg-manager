import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
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
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => NotificationModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  notificationId!: string;

  @BelongsTo(() => NotificationModel)
  notification!: NotificationModel;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  isRead?: boolean;
}
