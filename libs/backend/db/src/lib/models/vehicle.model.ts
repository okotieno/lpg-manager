import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { TransporterModel } from './transporter.model';
import { DriverModel } from './driver.model';
import { DriverVehicleModel } from './driver-vehicle.model';

@Table({
  tableName: 'vehicles',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class VehicleModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => TransporterModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  transporterId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  registrationNumber!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  capacity!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @BelongsTo(() => TransporterModel)
  transporter!: TransporterModel;

  @BelongsToMany(() => DriverModel, () => DriverVehicleModel)
  drivers!: DriverModel[];
} 