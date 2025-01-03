import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { TransporterModel } from './transporter.model';
import { UserModel } from './user.model';
import { VehicleModel } from './vehicle.model';
import { DriverVehicleModel } from './driver-vehicle.model';

@Table({
  tableName: 'drivers',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class DriverModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @ForeignKey(() => TransporterModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  transporterId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  licenseNumber!: string;

  @BelongsTo(() => TransporterModel)
  transporter!: TransporterModel;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @BelongsToMany(() => VehicleModel, () => DriverVehicleModel)
  vehicles!: VehicleModel[];
}
