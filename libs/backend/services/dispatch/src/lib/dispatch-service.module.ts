import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CatalogueModel, DispatchModel, InventoryItemModel, OrderItemModel, OrderModel } from '@lpg-manager/db';
import { DispatchService } from './services/dispatch.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      DispatchModel,
      OrderModel,
      OrderItemModel,
      CatalogueModel,
      InventoryItemModel
    ])],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchServiceModule {}
