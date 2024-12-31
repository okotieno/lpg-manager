import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import { CartModel } from './cart.model';
import { StationModel } from './station.model';
import { OrderItemModel } from './order-item.model';

@Table({
  tableName: 'orders',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class OrderModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => CartModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  cartId!: string;

  @ForeignKey(() => StationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  depotId!: string;

  @ForeignKey(() => StationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  dealerId!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  totalPrice!: number;

  @Column({
    type: DataType.ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'REJECTED'),
    allowNull: false,
    defaultValue: 'PENDING'
  })
  status!: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'REJECTED';

  @BelongsTo(() => StationModel, 'depotId')
  depot!: StationModel;

  @BelongsTo(() => StationModel, 'dealerId')
  dealer!: StationModel;

  @BelongsTo(() => CartModel)
  cart!: CartModel;

  @HasMany(() => OrderItemModel)
  items!: OrderItemModel[];
}
