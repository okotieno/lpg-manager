import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CartEvent } from '../events/cart.event';
import { OrderService } from '@lpg-manager/order-service';

@Injectable()
export class CartEventsListenerService {
  constructor(private orderService: OrderService) {}

  @OnEvent('cart.completed')
  async createOrders($event: CartEvent) {
    console.log($event.cart.items[0]);
    const totalPrice = $event.cart?.totalPrice ?? 0;
    const order = await this.orderService.createOrder($event.cart?.id, totalPrice);
  }
}
