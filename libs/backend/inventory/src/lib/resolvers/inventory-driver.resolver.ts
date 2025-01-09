import { Resolver, Query, Args } from '@nestjs/graphql';
import { DriverInventoryModel, InventoryModel, IQueryParam } from '@lpg-manager/db';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { DriverInventoryService } from '@lpg-manager/inventory-service';

@Resolver(() => DriverInventoryModel)
export class InventoryDriverResolver {
  constructor(private readonly driverInventoryService: DriverInventoryService) {}

  @Query(() => InventoryModel)
  @UseGuards(JwtAuthGuard)
  driverInventories(@Args('query') query: IQueryParam) {
    return this.driverInventoryService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

}
