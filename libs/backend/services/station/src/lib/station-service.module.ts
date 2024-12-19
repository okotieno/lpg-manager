import { Module } from '@nestjs/common';
import { StationService } from './services/station.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BrandModel, StationModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([StationModel])
  ],
  providers: [
    StationService
  ],
  exports: [
    StationService
  ],
})
export class StationServiceModule {}
