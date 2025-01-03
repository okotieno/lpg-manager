import { Module } from '@nestjs/common';
import { CatalogueService } from './services/catalogue.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BrandModel, CatalogueModel } from '@lpg-manager/db';

@Module({
  imports: [SequelizeModule.forFeature([CatalogueModel, BrandModel])],
  providers: [CatalogueService],
  exports: [CatalogueService],
})
export class CatalogueServiceModule {}
