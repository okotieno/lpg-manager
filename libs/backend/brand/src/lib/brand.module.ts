import { Module } from '@nestjs/common';
import { BrandResolver } from './resolvers/brand.resolver';
import { BrandServiceModule } from '@lpg-manager/brand-service';
import { CatalogueServiceModule } from '@lpg-manager/catalogue-service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BrandFileUploadModel } from '@lpg-manager/db';

@Module({
  imports: [
    BrandServiceModule,
    CatalogueServiceModule,
    SequelizeModule.forFeature([BrandFileUploadModel]),
  ],
  providers: [BrandResolver],
})
export class BrandModule {}
