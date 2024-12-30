import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Root,
  Resolver,
} from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { OrderService } from '@lpg-manager/order-service';
import {
  IQueryParam,
  OrderModel,
  OrderItemModel,
  CatalogueModel,
  InventoryModel, StationModel
} from '@lpg-manager/db';
import { CreateOrderInputDto } from '../dto/create-order-input.dto';
import { UpdateOrderStatusInput } from '../dto/update-order-status.dto';

@Resolver(() => OrderModel)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Mutation(() => OrderModel)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateOrder)
  async createOrder(
    @Body('params', new ValidationPipe()) params: CreateOrderInputDto
  ) {
    const order = await this.orderService.createOrder(
      params.cartId,
      params.depotId,
      params.totalPrice,
      params.items
    );

    return {
      message: 'Order created successfully',
      data: order,
    };
  }

  @Query(() => OrderModel)
  async orders(@Args('query') query: IQueryParam) {
    return this.orderService.findAll(
      {
        ...query,
        filters: query?.filters ?? [],
      },
      [
        {
          model: OrderItemModel,
          include: [CatalogueModel, InventoryModel],
        },
      ]
    );
  }

  @Query(() => OrderModel)
  async order(@Args('id') id: string) {
    return this.orderService.findById(id, {
      include: [
        {
          model: OrderItemModel,
          include: [CatalogueModel, InventoryModel],
        },
      ],
    });
  }

  @Mutation(() => OrderModel)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteOrder)
  async deleteOrder(@Args('id') id: string) {
    await this.orderService.deleteById(id);
    return {
      message: 'Successfully deleted order',
    };
  }

  @ResolveField('items')
  async getItems(@Root() order: OrderModel) {
    const orderWithItems = await this.orderService.findById(order.id, {
      include: [
        {
          model: OrderItemModel,
          include: [CatalogueModel, InventoryModel],
        },
      ],
    });
    return orderWithItems?.items ?? [];
  }

  @ResolveField('depot')
  async getDepot(@Root() order: OrderModel) {
    const orderWithDepot = await this.orderService.findById(order.id, {
      include: [{
        model: StationModel,
        as: 'depot',
      }],
    });
    return orderWithDepot?.depot;
  }

  @ResolveField('dealer')
  async getDealer(@Root() order: OrderModel) {
    const orderWithDepot = await this.orderService.findById(order.id, {
      include: [{
        model: StationModel,
        as: 'dealer',
      }],
    });
    return orderWithDepot?.dealer;
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateOrder)
  async updateOrderStatus(
    @Args('id') id: string,
    @Args('params') params: UpdateOrderStatusInput
  ) {
    const order = await this.orderService.updateOrderStatus(id, params.status);

    return {
      message: 'Order status updated successfully',
      data: order,
    };
  }
}
