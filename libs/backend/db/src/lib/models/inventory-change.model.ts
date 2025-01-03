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

  @BelongsTo(() => InventoryModel)
  inventory!: InventoryModel;
} 