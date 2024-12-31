import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { TransporterModel } from './transporter.model';
import { DriverModel } from './driver.model';
import { VehicleModel } from './vehicle.model';
import { OrderModel } from './order.model';

export enum DispatchStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

@Table({
  tableName: 'dispatches',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class DispatchModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => TransporterModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  transporterId!: string;

  @ForeignKey(() => DriverModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  driverId!: string;

  @ForeignKey(() => VehicleModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  vehicleId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(DispatchStatus)),
    allowNull: false,
    defaultValue: DispatchStatus.PENDING,
  })
  status!: DispatchStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dispatchDate!: Date;

  @BelongsTo(() => TransporterModel)
  transporter!: TransporterModel;

  @BelongsTo(() => DriverModel)
  driver!: DriverModel;

  @BelongsTo(() => VehicleModel)
  vehicle!: VehicleModel;

  @HasMany(() => OrderModel)
  orders!: OrderModel[];
} 