import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo
} from 'sequelize-typescript';
import { CartModel } from './cart.model';
import { StationModel } from './station.model';

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
  stationId!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  totalPrice!: number;

  @Column({
    type: DataType.ENUM('PENDING', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'PENDING'
  })
  status!: 'PENDING' | 'COMPLETED';

  @BelongsTo(() => StationModel)
  station!: StationModel;

  @BelongsTo(() => CartModel)
  cart!: CartModel;
} 