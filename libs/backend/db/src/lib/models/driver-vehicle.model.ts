import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DriverModel } from './driver.model';
import { VehicleModel } from './vehicle.model';

@Table({
  tableName: 'driver_vehicle',
  underscored: true,
  timestamps: true,
})
export class DriverVehicleModel extends Model {
  @ForeignKey(() => DriverModel)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  driverId!: string;

  @ForeignKey(() => VehicleModel)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  vehicleId!: string;
}
