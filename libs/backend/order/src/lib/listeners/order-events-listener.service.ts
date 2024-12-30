// libs/backend/order/src/lib/listeners/order-events-listener.service.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderEvent } from '../events/order.event';
import { NotificationService } from '@lpg-manager/notification-service';

@Injectable()
export class OrderEventsListener {
  constructor(private notificationService: NotificationService) {}

  @OnEvent('order.created')
  async handleOrderCreated(event: OrderEvent) {
    // Handle order created event
    // e.g., send notifications, update inventory, etc.
  }

  @OnEvent('order.confirmed')
  async handleOrderConfirmed(event: OrderEvent) {
    // Handle order confirmed event
    // e.g., send confirmation notifications
  }

  @OnEvent('order.completed')
  async handleOrderCompleted(event: OrderEvent) {
    // Handle order completed event
    // e.g., send completion notifications
  }

  @OnEvent('order.canceled')
  async handleOrderCanceled(event: OrderEvent) {
    // Handle order canceled event
    // e.g., send cancellation notifications
  }
}
