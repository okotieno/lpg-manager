import { Module } from '@nestjs/common';
import { TransporterService } from './services/transporter.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransporterModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([TransporterModel])
  ],
  providers: [
    TransporterService
  ],
  exports: [
    TransporterService
  ],
})
export class TransporterServiceModule {} 