import { Module } from '@nestjs/common';
import { BrandResolver } from './resolvers/brand.resolver';
import { BrandServiceModule } from '@lpg-manager/brand-service';
import { UserServiceModule } from '@lpg-manager/user-service';
import { CatalogueServiceModule } from '@lpg-manager/catalogue-service';

@Module({
  imports: [
    BrandServiceModule,
    UserServiceModule,
    CatalogueServiceModule
  ],
  providers: [
    BrandResolver
  ],
})
export class BrandModule {
}
