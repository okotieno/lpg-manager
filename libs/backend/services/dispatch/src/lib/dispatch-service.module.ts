import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DispatchModel, OrderModel } from '@lpg-manager/db';
import { DispatchService } from './services/dispatch.service';

@Module({
  imports: [
    SequelizeModule.forFeature([DispatchModel, OrderModel])
  ],
  providers: [
    DispatchService
  ],
  exports: [
    DispatchService
  ],
})
export class DispatchServiceModule {}
