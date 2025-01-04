import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { InventoryModel } from './inventory.model';
import { UserModel } from './user.model';

export enum InventoryItemStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  RESERVED = 'RESERVED',
  DAMAGED = 'DAMAGED',
  RETURNED = 'RETURNED',
}

@Table({
  tableName: 'inventory_items',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class InventoryItemModel extends Model {
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
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  serialNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  batchNumber!: string;

  @Column({
    type: DataType.ENUM(...Object.values(InventoryItemStatus)),
    allowNull: false,
    defaultValue: InventoryItemStatus.AVAILABLE,
  })
  status!: InventoryItemStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  manufactureDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiryDate?: Date;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy!: string;

  @BelongsTo(() => InventoryModel)
  inventory!: InventoryModel;

  @BelongsTo(() => UserModel)
  creator!: UserModel;
}
