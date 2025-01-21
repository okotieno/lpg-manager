import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { CartModel } from './cart.model';
import { StationModel } from './station.model';
import { OrderItemModel } from './order-item.model';
import { DispatchModel } from './dispatch.model';
import { IOrderStatus } from '@lpg-manager/types';
import { ConsolidatedOrderModel } from './consolidated-order.model';

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
    type: DataType.ENUM(...Object.values(IOrderStatus)),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  status!: IOrderStatus

  @BelongsTo(() => StationModel, 'depotId')
  depot!: StationModel;

  @BelongsTo(() => StationModel, 'dealerId')
  dealer!: StationModel;

  @BelongsTo(() => CartModel)
  cart!: CartModel;

  @HasMany(() => OrderItemModel)
  items!: OrderItemModel[];

  @ForeignKey(() => DispatchModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  dispatchId?: string;

  @BelongsTo(() => DispatchModel)
  dispatch?: DispatchModel;

  @ForeignKey(() => ConsolidatedOrderModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  consolidatedOrderId?: string;

  @BelongsTo(() => ConsolidatedOrderModel)
  consolidatedOrder?: ConsolidatedOrderModel;
}
