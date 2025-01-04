import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { InventoryModel } from './inventory.model';

export enum InventoryChangeType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

export enum ReferenceType {
  MANUAL = 'MANUAL',      // Manual inventory adjustments
  ORDER = 'ORDER',        // Changes due to customer orders
  RETURN = 'RETURN',      // Changes due to returns/refunds
  DISPATCH = 'DISPATCH',  // Changes due to dispatch operations
  TRANSFER = 'TRANSFER',  // Inter-station transfers
  ADJUSTMENT = 'ADJUSTMENT' // System or audit adjustments
}

@Table({
  tableName: 'inventory_changes',
  underscored: true,
  timestamps: true,
})
export class InventoryChangeModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => InventoryModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  inventoryId!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.ENUM(...Object.values(InventoryChangeType)),
    allowNull: false,
  })
  type!: InventoryChangeType;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reason?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReferenceType)),
    allowNull: false,
    defaultValue: ReferenceType.MANUAL,
  })
  referenceType!: ReferenceType;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  referenceId?: string;

  @BelongsTo(() => InventoryModel)
  inventory!: InventoryModel;
}
