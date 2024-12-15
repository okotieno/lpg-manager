import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { ActivityLogModel } from './activity-log.model';
import { UserModel } from './user.model';

@Table({
  tableName: 'activity_log_user',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ActivityLogUserModel extends Model<ActivityLogUserModel> {
  @ForeignKey(() => ActivityLogModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'activity_log_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  activityLogId!: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  userId!: string;

  @BelongsTo(() => ActivityLogModel)
  activityLog!: ActivityLogModel;

  @BelongsTo(() => UserModel)
  user!: UserModel;
}
