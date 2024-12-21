import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { BrandModel } from './brand.model';
import { InventoryModel } from './inventory.model';

@Table({
  tableName: 'catalogues',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class CatalogueModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => BrandModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  brandId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  pricePerUnit?: number;

  @Column({
    type: DataType.ENUM('KG', 'LITRE'),
    allowNull: false,
  })
  unit!: 'KG' | 'LITRE';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  quantityPerUnit!: number;

  @BelongsTo(() => BrandModel)
  brand!: BrandModel;

  @HasMany(() => InventoryModel)
  inventories!: InventoryModel[];
}
