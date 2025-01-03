import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartModel, OrderItemModel, OrderModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderModel, OrderItemModel, CartModel]),
  ],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderServiceModule {}
