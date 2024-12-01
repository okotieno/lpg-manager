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
    type: DataType.INTEGER,
    allowNull: false,
    field: 'activity_log_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  activityLogId!: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  userId!: number;

  @BelongsTo(() => ActivityLogModel)
  activityLog!: ActivityLogModel;

  @BelongsTo(() => UserModel)
  user!: UserModel;
}
