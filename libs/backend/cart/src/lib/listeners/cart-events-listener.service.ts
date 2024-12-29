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
    const stationOrders = new Map<string, {
      totalPrice: number;
      items: Array<{
        catalogueId: string;
        inventoryId: string;
        quantity: number;
        pricePerUnit: number;
      }>;
    }>();

    for (const item of $event.cart.items) {
      const stationId = item.inventory.station.id;
      const itemTotal = item.quantity * (item.catalogue.pricePerUnit || 0);

      if (!stationOrders.has(stationId)) {
        stationOrders.set(stationId, {
          totalPrice: 0,
          items: []
        });
      }

      const stationOrder = stationOrders.get(stationId);
      if (stationOrder) {
        stationOrder.totalPrice += itemTotal;
        stationOrder.items.push({
          catalogueId: item.catalogue.id,
          inventoryId: item.inventory.id,
          quantity: item.quantity,
          pricePerUnit: item.catalogue.pricePerUnit as number,
        });
      }
    }

    // Create an order for each station
    for (const [stationId, orderData] of stationOrders) {
      await this.orderService.createOrder(
        $event.cart.id,
        stationId,
        orderData.totalPrice,
        orderData.items
      );
    }
  }
}
