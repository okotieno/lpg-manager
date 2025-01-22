import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrderModel } from './order.model';
import { CatalogueModel } from './catalogue.model';
import { InventoryModel } from './inventory.model';

@Table({
  tableName: 'order_items',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class OrderItemModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => OrderModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  orderId!: string;

  @ForeignKey(() => CatalogueModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  catalogueId!: string;

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
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  pricePerUnit!: number;

  @BelongsTo(() => OrderModel)
  order!: OrderModel;

  @BelongsTo(() => CatalogueModel)
  catalogue!: CatalogueModel;

  @BelongsTo(() => InventoryModel)
  inventory!: InventoryModel;
}
