import { Module } from '@nestjs/common';
import { DriverService } from './services/driver.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DriverModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([DriverModel])
  ],
  providers: [
    DriverService
  ],
  exports: [
    DriverService
  ],
})
export class DriverServiceModule {} 