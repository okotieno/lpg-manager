import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  CatalogueModel,
  ConsolidatedOrderModel,
  DispatchModel, InventoryChangeModel,
  InventoryItemModel, InventoryModel,
  OrderItemModel,
  OrderModel
} from '@lpg-manager/db';
import { DispatchService } from './services/dispatch.service';
import { InventoryServiceModule } from '@lpg-manager/inventory-service';

@Module({
  imports: [
    InventoryServiceModule,
    SequelizeModule.forFeature([
      DispatchModel,
      OrderModel,
      OrderItemModel,
      CatalogueModel,
      InventoryItemModel,
      InventoryModel,
      ConsolidatedOrderModel,
      InventoryChangeModel
    ])],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchServiceModule {}
