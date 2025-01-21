import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  CartModel,
  ConsolidatedOrderModel,
  OrderItemModel,
  OrderModel,
} from '@lpg-manager/db';
import { ConsolidatedOrderService } from './services/consolidated-order.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      OrderModel,
      OrderItemModel,
      CartModel,
      ConsolidatedOrderModel,
    ]),
  ],
  providers: [OrderService, ConsolidatedOrderService],
  exports: [OrderService, ConsolidatedOrderService],
})
export class OrderServiceModule {}
