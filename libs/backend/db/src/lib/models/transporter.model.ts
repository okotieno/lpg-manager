import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { DriverModel } from './driver.model';
import { VehicleModel } from './vehicle.model';

@Table({
  tableName: 'transporters',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class TransporterModel extends Model {
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
    type: DataType.STRING,
    allowNull: false,
  })
  contactPerson!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone!: string;

  @HasMany(() => DriverModel)
  drivers!: DriverModel[];

  @HasMany(() => VehicleModel)
  vehicles!: VehicleModel[];
}
