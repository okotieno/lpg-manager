import { Module } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModel, InventoryChangeModel, InventoryItemModel } from '@lpg-manager/db';
import { InventoryChangeService } from './services/inventory-change.service';

@Module({
  imports: [SequelizeModule.forFeature([
    InventoryModel,
    InventoryChangeModel,
    InventoryItemModel
  ])],
  providers: [InventoryService, InventoryChangeService],
  exports: [InventoryService, InventoryChangeService],
})
export class InventoryServiceModule {}
