import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CartEvent } from '../events/cart.event';
import { OrderService } from '@lpg-manager/order-service';

@Injectable()
export class CartEventsListenerService {
  constructor(private orderService: OrderService) {}

  @OnEvent('cart.completed')
  async createOrders($event: CartEvent) {
    // Group cart items by station
    const stationOrders = new Map<string, number>();
    
    for (const item of $event.cart.items) {
      const stationId = item.inventory.station.id;
      const itemTotal = item.quantity * (item.catalogue.pricePerUnit || 0);
      
      if (stationOrders.has(stationId)) {
        stationOrders.set(stationId, stationOrders.get(stationId)! + itemTotal);
      } else {
        stationOrders.set(stationId, itemTotal);
      }
    }

    // Create an order for each station
    for (const [stationId, totalPrice] of stationOrders) {
      await this.orderService.createOrder($event.cart.id, stationId, totalPrice);
    }
  }
}
