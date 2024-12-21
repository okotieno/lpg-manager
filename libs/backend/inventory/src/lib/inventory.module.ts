import { Module } from '@nestjs/common';
import { InventoryResolver } from './resolvers/inventory.resolver';
import { InventoryServiceModule } from '@lpg-manager/inventory-service';
import { UserServiceModule } from '@lpg-manager/user-service';

@Module({
  imports: [
    InventoryServiceModule,
    UserServiceModule
  ],
  providers: [
    InventoryResolver
  ],
})
export class InventoryModule {
}
