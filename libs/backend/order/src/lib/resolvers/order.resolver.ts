import {
  Args,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@lpg-manager/auth';
import { PermissionGuard, Permissions } from '@lpg-manager/permission-service';
import { IPermissionEnum } from '@lpg-manager/types';
import {
  ConsolidatedOrderService,
  OrderService,
} from '@lpg-manager/order-service';
import {
  CatalogueModel,
  DispatchModel,
  DriverInventoryModel,
  InventoryModel,
  IQueryParam,
  OrderItemModel,
  OrderModel,
  StationModel,
  UserModel,
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
import { DispatchService } from '@lpg-manager/dispatch-service';

@ObjectType()
class OrderStats {
  @Field(() => Int)
  pendingOrders!: number;

  @Field(() => Int)
  completedOrders!: number;
}

@Resolver(() => OrderModel)
export class OrderResolver {
  constructor(
    private orderService: OrderService,
    private dispatchService: DispatchService,
    private consolidatedOrderService: ConsolidatedOrderService,
    private eventEmitter: EventEmitter2
  ) {}

  @Mutation(() => OrderModel)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.CreateOrder)
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
  @Permissions(IPermissionEnum.DeleteOrder)
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

  @ResolveField('consolidatedOrder')
  async getConsolidatedOrder(@Root() orderModel: OrderModel) {
    return await this.consolidatedOrderService.model.findOne({
      where: { id: orderModel.consolidatedOrderId },
    });
  }

  @ResolveField('dispatchStatus')
  async getDispatchStatus(@Root() orderModel: OrderModel) {
    const order = await this.dispatchService.model.findOne({
      where: { id: orderModel.dispatchId },
      include: [DriverInventoryModel],
    });
    return order?.driverInventories[0]?.status ?? 'PENDING'
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.UpdateOrder)
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

  @Query(() => OrderStats)
  @UseGuards(JwtAuthGuard)
  async orderStats() {
    const stats = await this.orderService.getOrderStats();
    return stats;
  }
}
