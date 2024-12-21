import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { StationModel } from './station.model';
import { CatalogueModel } from './catalogue.model';

@Table({
  tableName: 'inventory',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class InventoryModel extends Model {
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
    allowNull: false,
  })
  stationId!: string;

  @ForeignKey(() => CatalogueModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  catalogueId!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  quantity!: number;

  @BelongsTo(() => StationModel)
  station!: StationModel;

  @BelongsTo(() => CatalogueModel)
  catalogue!: CatalogueModel;
} 