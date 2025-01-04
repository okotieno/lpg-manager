import { Module } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModel, InventoryChangeModel, InventoryItemModel } from '@lpg-manager/db';

@Module({
  imports: [SequelizeModule.forFeature([
    InventoryModel,
    InventoryChangeModel,
    InventoryItemModel
  ])],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryServiceModule {}
