import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderModel])
  ],
  providers: [
    OrderService
  ],
  exports: [
    OrderService
  ],
})
export class OrderServiceModule {}
