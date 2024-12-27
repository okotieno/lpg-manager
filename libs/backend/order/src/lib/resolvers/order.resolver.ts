import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OrderService } from '@lpg-manager/order-service';
import { OrderModel } from '@lpg-manager/db';

@Resolver(() => OrderModel)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  // @Mutation(() => OrderModel)
  // async createOrder(
  //   @Args('orderId') orderId: string,
  //   @Args('totalPrice') totalPrice: number
  // ) {
  //   return this.orderService.createOrder(orderId, totalPrice);
  // }
}
