import { Module } from '@nestjs/common';
import { InventoryResolver } from './resolvers/inventory.resolver';
import { InventoryServiceModule } from '@lpg-manager/inventory-service';
import { CatalogueServiceModule } from '@lpg-manager/catalogue-service';
import { StationServiceModule } from '@lpg-manager/station-service';
import { InventoryChangeResolver } from './resolvers/inventory-change.resolver';

@Module({
  imports: [
    InventoryServiceModule,
    StationServiceModule,
    CatalogueServiceModule,
  ],
  providers: [InventoryResolver, InventoryChangeResolver],
})
export class InventoryModule {}
