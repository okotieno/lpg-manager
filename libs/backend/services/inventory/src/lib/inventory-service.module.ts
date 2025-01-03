import { Module } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModel, InventoryChangeModel } from '@lpg-manager/db';

@Module({
  imports: [SequelizeModule.forFeature([InventoryModel, InventoryChangeModel])],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryServiceModule {}
