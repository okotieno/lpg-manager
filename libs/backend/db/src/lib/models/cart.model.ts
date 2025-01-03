import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { CartCatalogueModel } from './cart-catalogue.model';
import { UserModel } from './user.model';
import { StationModel } from './station.model';

export enum CartStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Table({
  tableName: 'carts',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class CartModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @ForeignKey(() => StationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  dealerId!: string;

  @BelongsTo(() => StationModel)
  dealer!: StationModel;

  @HasMany(() => CartCatalogueModel)
  items!: CartCatalogueModel[];

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  totalQuantity?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  totalPrice?: number;

  @Column({
    type: DataType.ENUM(...Object.values(CartStatus)),
    allowNull: false,
    defaultValue: CartStatus.PENDING
  })
  status!: CartStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date;
}
