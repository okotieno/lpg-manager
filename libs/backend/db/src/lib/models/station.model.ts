import {
  Column,
  Model,
  Table,
  DataType,
  BelongsToMany
} from 'sequelize-typescript';
import { BrandModel } from './brand.model';

@Table({
  tableName: 'stations',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class StationModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.ENUM('DEPOT', 'DEALER'),
    allowNull: false,
  })
  type!: 'DEPOT' | 'DEALER';

  @BelongsToMany(() => BrandModel, {
    through: 'depot_brands',
    foreignKey: 'depot_id',
    otherKey: 'brand_id'
  })
  brands?: BrandModel[];
}
