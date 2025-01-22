import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { StationModel } from './station.model';
import { OrderModel } from './order.model';
import { DispatchModel } from './dispatch.model';
import { IConsolidatedOrderStatus } from '@lpg-manager/types';

@Table({
  tableName: 'consolidated_orders',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class ConsolidatedOrderModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => DispatchModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  dispatchId!: string;

  @ForeignKey(() => StationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  dealerId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(IConsolidatedOrderStatus)),
    allowNull: false,
    defaultValue: IConsolidatedOrderStatus.Created,
  })
  status!: IConsolidatedOrderStatus;

  @BelongsTo(() => DispatchModel)
  dispatch!: DispatchModel;

  @BelongsTo(() => StationModel)
  dealer!: StationModel;

  @HasMany(() => OrderModel)
  orders!: OrderModel[];
}
