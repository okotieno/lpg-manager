import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItemModel, OrderModel } from '@lpg-manager/db';

@Module({
  imports: [SequelizeModule.forFeature([OrderModel, OrderItemModel])],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderServiceModule {}
