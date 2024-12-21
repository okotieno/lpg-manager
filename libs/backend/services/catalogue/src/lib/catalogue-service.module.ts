import { Module } from '@nestjs/common';
import { CatalogueService } from './services/catalogue.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CatalogueModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([CatalogueModel])
  ],
  providers: [
    CatalogueService
  ],
  exports: [
    CatalogueService
  ],
})
export class CatalogueServiceModule {}
