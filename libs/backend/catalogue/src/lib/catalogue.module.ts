import { Module } from '@nestjs/common';
import { CatalogueResolver } from './resolvers/catalogue.resolver';
import { CatalogueServiceModule } from '@lpg-manager/catalogue-service';
import { BrandServiceModule } from '@lpg-manager/brand-service';

@Module({
  imports: [
    CatalogueServiceModule,
    BrandServiceModule
  ],
  providers: [
    CatalogueResolver
  ],
})
export class CatalogueModule {
}
