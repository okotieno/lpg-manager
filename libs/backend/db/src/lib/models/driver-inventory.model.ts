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

export enum DriverInventoryStatus {
  ASSIGNED = 'ASSIGNED',      // Driver has received the canister
  IN_TRANSIT = 'IN_TRANSIT',  // Canister is being transported
  DELIVERED = 'DELIVERED',    // Canister was delivered to customer
  RETURNED = 'RETURNED'       // Canister was returned to depot
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
} 