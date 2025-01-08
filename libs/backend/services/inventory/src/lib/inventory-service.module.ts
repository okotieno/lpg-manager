import { Module } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModel, InventoryChangeModel, InventoryItemModel, DriverInventoryModel } from '@lpg-manager/db';
import { InventoryChangeService } from './services/inventory-change.service';
import { InventoryItemService } from './services/inventory-item.service';
import { DriverInventoryService } from './services/driver-inventory.service';

@Module({
  imports: [SequelizeModule.forFeature([
    InventoryModel,
    InventoryChangeModel,
    InventoryItemModel,
    DriverInventoryModel
  ])],
  providers: [InventoryService, InventoryChangeService, InventoryItemService, DriverInventoryService],
  exports: [InventoryService, InventoryChangeService, InventoryItemService, DriverInventoryService],
})
export class InventoryServiceModule {}
