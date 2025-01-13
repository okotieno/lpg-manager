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
import { DriverInventoryModel } from './driver-inventory.model';

export enum DispatchStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  
  // Filled Canisters Flow
  FILLED_DEPOT_TO_DRIVER = 'FILLED_DEPOT_TO_DRIVER',
  FILLED_DRIVER_CONFIRMED = 'FILLED_DRIVER_CONFIRMED',
  FILLED_DELIVERED_TO_DEALER = 'FILLED_DELIVERED_TO_DEALER',
  
  // Empty Canisters Flow
  EMPTY_COLLECTED_FROM_DEALER = 'EMPTY_COLLECTED_FROM_DEALER',
  EMPTY_RETURNED_TO_DEPOT = 'EMPTY_RETURNED_TO_DEPOT',
  
  // Final Status
  COMPLETED = 'COMPLETED'
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

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  filledDepotToDriverAt: Date | null = null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  filledDriverConfirmedAt: Date | null = null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  filledDeliveredToDealerAt: Date | null = null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  emptyCollectedFromDealerAt: Date | null = null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  emptyReturnedToDepotAt: Date | null = null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isFilledDeliveryCompleted: boolean = false;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isEmptyReturnCompleted: boolean = false;

  @BelongsTo(() => TransporterModel)
  transporter!: TransporterModel;

  @BelongsTo(() => DriverModel)
  driver!: DriverModel;

  @BelongsTo(() => VehicleModel)
  vehicle!: VehicleModel;

  @HasMany(() => OrderModel)
  orders!: OrderModel[];

  @HasMany(() => DriverInventoryModel)
  driverInventories!: DriverInventoryModel[];
}
