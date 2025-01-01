import { Module } from '@nestjs/common';
import { VehicleService } from './services/vehicle.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DriverModel, DriverVehicleModel, VehicleModel } from '@lpg-manager/db';

@Module({
  imports: [SequelizeModule.forFeature([VehicleModel, DriverVehicleModel])],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleServiceModule {}
