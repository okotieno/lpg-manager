import { Module } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModel } from '@lpg-manager/db';

@Module({
  imports: [SequelizeModule.forFeature([InventoryModel])],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryServiceModule {}
