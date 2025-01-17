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
import { CurrentUser, JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
} from '@lpg-manager/permission-service';
import { IPermissionEnum } from '@lpg-manager/types';
import { InventoryService } from '@lpg-manager/inventory-service';
import {
  CatalogueModel,
  InventoryModel,
  InventoryItemModel,
  IQueryParam,
  StationModel,
  UserModel,
  InventoryItemStatus,
  ReferenceType,
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
  @Permissions(IPermissionEnum.CreateInventory)
   async createInventory(
    @Body('params', new ValidationPipe()) params: CreateInventoryInputDto,
    @CurrentUser() user: UserModel
  ) {
    const inventory = await this.inventoryService.createOrUpdateInventory({
      catalogueId: params.catalogueId,
      stationId: params.stationId,
      quantity: params.quantity,
      reason: params.reason,
      userId: user.id,
      batchNumber: params.batchNumber,
      serialNumbers: params.serialNumbers,
      ...(params.manufactureDate
        ? { manufactureDate: new Date(params.manufactureDate) }
        : undefined),
      ...(params.expiryDate
        ? { expiryDate: new Date(params.expiryDate) }
        : undefined),
    });

    return {
      message: 'Inventory created successfully',
      data: inventory,
    };
  }

  @Mutation(() => InventoryItemModel)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.UpdateInventory)
  async updateInventoryItemStatus(
    @Body('params', new ValidationPipe())
    params: {
      itemId: string;
      status: InventoryItemStatus;
      reason?: string;
    },
    @CurrentUser() user: UserModel
  ) {
    return this.inventoryService.updateItemStatus(
      params.itemId,
      params.status,
      user.id,
      ReferenceType.MANUAL,
      undefined,
      params.reason
    );
  }

  @Query(() => InventoryModel)
  @UseGuards(JwtAuthGuard)
  inventories(@Args('query') query: IQueryParam) {
    return this.inventoryService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => InventoryModel)
  @UseGuards(JwtAuthGuard)
  async inventory(@Args('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Mutation(() => InventoryModel)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.DeleteInventory)
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
