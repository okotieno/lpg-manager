import { Column, ForeignKey, Model, Table, DataType } from 'sequelize-typescript';
import { StationModel } from './station.model';
import { BrandModel } from './brand.model';

@Table({
  tableName: 'depot_brands',
  underscored: true,
  paranoid: true,
  timestamps: true
})
export class DepotBrandModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => StationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  depotId!: string;

  @ForeignKey(() => BrandModel)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  brandId!: string;

}
