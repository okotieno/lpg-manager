// libs/backend/order/src/lib/events/order.event.ts
import { OrderModel } from '@lpg-manager/db';

export class OrderEvent {
  constructor(public order: OrderModel, public userId: string) {}
}

export class OrderCreatedEvent extends OrderEvent {}
export class OrderConfirmedEvent extends OrderEvent {}
export class OrderCompletedEvent extends OrderEvent {}
export class OrderCanceledEvent extends OrderEvent {}
export class OrderRejectedEvent extends OrderEvent {}
