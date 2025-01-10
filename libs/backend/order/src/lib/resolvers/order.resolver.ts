import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { OrderService } from '@lpg-manager/order-service';
import {
  CatalogueModel,
  DispatchModel, DriverInventoryModel,
  InventoryModel,
  IQueryParam,
  OrderItemModel,
  OrderModel,
  StationModel,
  UserModel
} from '@lpg-manager/db';
import { CreateOrderInputDto } from '../dto/create-order-input.dto';
import { UpdateOrderStatusInput } from '../dto/update-order-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  OrderCanceledEvent,
  OrderCompletedEvent,
  OrderConfirmedEvent,
  OrderRejectedEvent,
} from '../events/order.event';

@Resolver(() => OrderModel)
export class OrderResolver {
  constructor(
    private orderService: OrderService,
    private eventEmitter: EventEmitter2
  ) {}

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
      include: [
        {
          model: StationModel,
          as: 'depot',
        },
      ],
    });
    return orderWithDepot?.depot;
  }

  @ResolveField('dealer')
  async getDealer(@Root() order: OrderModel) {
    const orderWithDepot = await this.orderService.findById(order.id, {
      include: [
        {
          model: StationModel,
          as: 'dealer',
        },
      ],
    });
    return orderWithDepot?.dealer;
  }

  @ResolveField('dispatch')
  async getDispatch(@Root() orderModel: OrderModel) {
    const order = await this.orderService.model.findOne({
      where: { id: orderModel.id },
      include: [DispatchModel],
    });
    return order?.dispatch;
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateOrder)
  async updateOrderStatus(
    @Args('id') id: string,
    @Args('params') params: UpdateOrderStatusInput,
    @CurrentUser() currentUser: UserModel
  ) {
    const order = (await this.orderService.updateOrderStatus(
      id,
      params.status
    )) as OrderModel;

    switch (params.status) {
      case 'CONFIRMED':
        this.eventEmitter.emit(
          'order.confirmed',
          new OrderConfirmedEvent(order, currentUser.id)
        );
        break;
      case 'COMPLETED':
        this.eventEmitter.emit(
          'order.completed',
          new OrderCompletedEvent(order, currentUser.id)
        );
        break;
      case 'CANCELLED':
        this.eventEmitter.emit(
          'order.canceled',
          new OrderCanceledEvent(order, currentUser.id)
        );
        break;
      case 'REJECTED':
        this.eventEmitter.emit(
          'order.rejected',
          new OrderRejectedEvent(order, currentUser.id)
        );
        break;
    }

    return {
      message: 'Order status updated successfully',
      data: order,
    };
  }
}
