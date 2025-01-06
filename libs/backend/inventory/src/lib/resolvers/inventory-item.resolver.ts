import { Args, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { InventoryChangeModel, InventoryItemModel, InventoryModel, IQueryParam } from '@lpg-manager/db';
import { InventoryItemService } from '@lpg-manager/inventory-service';

@Resolver(() => InventoryItemModel)
export class InventoryItemResolver {
  constructor(private inventoryItemService: InventoryItemService) {}

  @Query(() => [InventoryItemModel])
  @UseGuards(JwtAuthGuard)
  inventoryItems(@Args('query') query: IQueryParam) {
    return this.inventoryItemService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @ResolveField('inventory', () => InventoryModel)
  async getInventory(@Root() inventoryChange: InventoryChangeModel) {
    const inventoryChangeWithInventory = await this.inventoryItemService.findById(
      inventoryChange.id,
      {
        include: [InventoryModel],
      }
    );
    return inventoryChangeWithInventory?.inventory;
  }
}
