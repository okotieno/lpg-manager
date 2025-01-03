import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { CreateInventoryInputDto } from '../dto/create-inventory-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { InventoryService } from '@lpg-manager/inventory-service';
import {
  CatalogueModel,
  InventoryModel,
  IQueryParam,
  StationModel,
} from '@lpg-manager/db';
import { CatalogueService } from '@lpg-manager/catalogue-service';
import { StationService } from '@lpg-manager/station-service';

@Resolver(() => InventoryModel)
export class InventoryResolver {
  constructor(
    private inventoryService: InventoryService,
    private stationService: StationService,
    private catalogueService: CatalogueService
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateInventory)
  async createInventory(
    @Body('params', new ValidationPipe()) params: CreateInventoryInputDto
  ) {
    const inventory = await this.inventoryService.createOrUpdateInventory({
      catalogueId: params.catalogueId,
      stationId: params.stationId,
      quantity: params.quantity,
      reason: 'Initial inventory creation/update',
    });

    return {
      message: 'Inventory created successfully',
      data: inventory,
    };
  }

  @Query(() => InventoryModel)
  inventories(@Args('query') query: IQueryParam) {
    return this.inventoryService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => InventoryModel)
  async inventory(@Args('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Mutation(() => InventoryModel)
  async deleteInventory(@Args('id') id: string) {
    await this.inventoryService.deleteById(id);

    return {
      message: 'Successfully deleted inventory',
    };
  }

  @ResolveField('station', () => StationModel)
  async getStation(@Root() inventory: InventoryModel) {
    return this.stationService.findById(inventory.stationId);
  }

  @ResolveField('catalogue', () => CatalogueModel)
  async getCatalogue(@Root() inventory: InventoryModel) {
    return this.catalogueService.findById(inventory.catalogueId);
  }
}
