import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { InventoryItemModel } from './inventory-item.model';
import { DriverModel } from './driver.model';
import { DispatchModel } from './dispatch.model';
import { StationModel } from './station.model';

export enum DriverInventoryStatus {
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  DRIVER_TO_DEALER_CONFIRMED = 'DRIVER_TO_DEALER_CONFIRMED',
  DEALER_FROM_DRIVER_CONFIRMED = 'DEALER_FROM_DRIVER_CONFIRMED',
  DEPOT_TO_DRIVER_CONFIRMED = 'DEPOT_TO_DRIVER_CONFIRMED',
  RETURNED = 'RETURNED',
}

@Table({
  tableName: 'driver_inventories',
  underscored: true,
  timestamps: true,
})
export class DriverInventoryModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  override id!: string;

  @ForeignKey(() => DriverModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  driverId!: string;

  @ForeignKey(() => InventoryItemModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  inventoryItemId!: string;

  @ForeignKey(() => DispatchModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  dispatchId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(DriverInventoryStatus)),
    allowNull: false,
    defaultValue: DriverInventoryStatus.ASSIGNED,
  })
  status!: DriverInventoryStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  assignedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  returnedAt?: Date;

  @BelongsTo(() => DriverModel)
  driver!: DriverModel;

  @BelongsTo(() => InventoryItemModel)
  inventoryItem!: InventoryItemModel;

  @BelongsTo(() => DispatchModel)
  dispatch!: DispatchModel;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  driverToDealerConfirmedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dealerFromDriverConfirmedAt?: Date;

  @ForeignKey(() => StationModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  recipientStationId?: string;

  @BelongsTo(() => StationModel)
  recipientStation!: StationModel;
}
