import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateInventoryInputDto } from '../dto/create-inventory-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { PermissionGuard, Permissions, PermissionsEnum } from '@lpg-manager/permission-service';
import { InventoryService } from '@lpg-manager/inventory-service';
import { IQueryParam, InventoryModel } from '@lpg-manager/db';

@Resolver(() => InventoryModel)
export class InventoryResolver {

  constructor(private inventoryService: InventoryService) {
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateInventory)
  async createInventory(@Body('params', new ValidationPipe()) params: CreateInventoryInputDto) {
    const inventory = await this.inventoryService.create({
      name: params.name,
      companyName: params.companyName,
    });

    if (params.images?.length) {
      await inventory.$set('images', params.images.map(img => img.id));
    }

    return {
      message: 'Inventory created successfully',
      data: inventory
    };
  }

  @Query(() => InventoryModel)
  inventories(
    @Args('query') query: IQueryParam
  ) {
    return this.inventoryService.findAll({
      ...query,
      filters: query?.filters ?? []
    });
  }

  @Query(() => InventoryModel)
  async inventory(
    @Args('id') id: string
  ) {
    return this.inventoryService.findById(id);
  }

  @Mutation(() => InventoryModel)
  async deleteInventory(
    @Args('id') id: string
  ) {
    await this.inventoryService.deleteById(id);

    return {
      message: 'Successfully deleted inventory'
    };
  }
}
