import { Resolver, Query, Args, ResolveField, Root } from '@nestjs/graphql';
import {
  DriverInventoryModel,
  InventoryItemModel,
  InventoryModel,
  IQueryParam
} from '@lpg-manager/db';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { DriverInventoryService, InventoryItemService } from '@lpg-manager/inventory-service';

@Resolver(() => DriverInventoryModel)
export class InventoryDriverResolver {
  constructor(
    private readonly driverInventoryService: DriverInventoryService,
    private readonly inventoryItemService: InventoryItemService
  ) {}

  @Query(() => InventoryModel)
  @UseGuards(JwtAuthGuard)
  async driverInventories(@Args('query') query: IQueryParam) {
    return this.driverInventoryService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @ResolveField('inventoryItem', () => InventoryItemModel)
  async getInventoryItem(@Root() catalogue: DriverInventoryModel) {
    return this.inventoryItemService.findById(catalogue.inventoryItemId, {
      include: [InventoryModel],
    });
  }
}
