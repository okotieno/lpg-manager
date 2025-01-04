import { Args, Query, Resolver, ResolveField, Root } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { InventoryChangeModel, InventoryItemModel, InventoryModel, IQueryParam } from '@lpg-manager/db';
import { InventoryChangeService } from '@lpg-manager/inventory-service';

@Resolver(() => InventoryChangeModel)
export class InventoryChangeResolver {
  constructor(private inventoryChangeService: InventoryChangeService) {}

  @Query(() => InventoryChangeModel)
  @UseGuards(JwtAuthGuard)
  async inventoryChange(@Args('id') id: string) {
    return this.inventoryChangeService.findById(id);
  }

  @Query(() => InventoryChangeModel)
  @UseGuards(JwtAuthGuard)
  async inventoryChanges(@Args('query') query: IQueryParam) {
    return this.inventoryChangeService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @ResolveField('items', () => [InventoryItemModel])
  async getItems(@Root() inventoryChange: InventoryChangeModel) {
    const inventoryChangeWithItems = await this.inventoryChangeService.findById(
      inventoryChange.id,
      {
        include: [
          {
            model: InventoryItemModel,
            include: [InventoryModel],
          },
        ],
      }
    );

    return inventoryChangeWithItems?.items ?? [];
  }

  @ResolveField('inventory', () => InventoryModel)
  async getInventory(@Root() inventoryChange: InventoryChangeModel) {
    const inventoryChangeWithInventory = await this.inventoryChangeService.findById(
      inventoryChange.id,
      {
        include: [InventoryModel],
      }
    );
    return inventoryChangeWithInventory?.inventory;
  }
}
