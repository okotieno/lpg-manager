import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { CartCatalogueModel } from './cart-catalogue.model';

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
}
