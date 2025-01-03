import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ActivityLogModel } from './activity-log.model';
import { ActivityLogUserModel } from './activity-log-user.model';
import { RoleModel } from './role.model';
import { RoleUserModel } from './role-user.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class UserModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  username?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  lastName!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  email?: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'email_verified_at',
  })
  emailVerifiedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'phone_verified_at',
  })
  phoneVerifiedAt?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'profile_description',
  })
  profileDescription?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_login_at',
  })
  lastLoginAt?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'last_login_ip',
  })
  lastLoginIp?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_activity_at',
  })
  lastActivityAt?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'remember_token',
  })
  rememberToken?: string;

  @BelongsToMany(() => ActivityLogModel, () => ActivityLogUserModel)
  activityLogs!: ActivityLogModel[];

  @BelongsToMany(() => RoleModel, {
    foreignKeyConstraint: true,
    through: 'role_user',
    foreignKey: 'user_id',
    otherKey: 'role_id',
  })
  roles!: RoleModel[];

  @Column({ type: DataType.STRING, allowNull: true })
  profilePhotoLink?: string;

  @HasMany(() => RoleUserModel)
  roleUsers!: RoleUserModel[];
}
