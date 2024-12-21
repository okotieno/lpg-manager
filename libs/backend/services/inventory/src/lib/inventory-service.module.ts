import { Module } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BrandModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([BrandModel])
  ],
  providers: [
    InventoryService
  ],
  exports: [
    InventoryService
  ],
})
export class InventoryServiceModule {}
