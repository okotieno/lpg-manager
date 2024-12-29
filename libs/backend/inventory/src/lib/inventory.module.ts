import { Module } from '@nestjs/common';
import { InventoryResolver } from './resolvers/inventory.resolver';
import { InventoryServiceModule } from '@lpg-manager/inventory-service';
import { UserServiceModule } from '@lpg-manager/user-service';
import { CatalogueServiceModule } from '@lpg-manager/catalogue-service';
import { StationServiceModule } from '@lpg-manager/station-service';

@Module({
  imports: [
    InventoryServiceModule,
    UserServiceModule,
    StationServiceModule,
    CatalogueServiceModule
  ],
  providers: [
    InventoryResolver
  ],
})
export class InventoryModule {
}
