import { Module } from '@nestjs/common';
import { CatalogueResolver } from './resolvers/catalogue.resolver';
import { CatalogueServiceModule } from '@lpg-manager/catalogue-service';
import { UserServiceModule } from '@lpg-manager/user-service';

@Module({
  imports: [
    CatalogueServiceModule,
    UserServiceModule
  ],
  providers: [
    CatalogueResolver
  ],
})
export class CatalogueModule {
}
