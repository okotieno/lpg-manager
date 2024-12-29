import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { CatalogueModel } from './catalogue.model';
import { CartModel } from './cart.model';
import { InventoryModel } from './inventory.model';

@Table({
  tableName: 'cart_catalogues',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class CartCatalogueModel extends Model {
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

  @BelongsTo(() => CartModel)
  cart!: CartModel;

  @BelongsTo(() => CatalogueModel)
  catalogue!: CatalogueModel;

  @BelongsTo(() => InventoryModel)
  inventory!: InventoryModel;
}
