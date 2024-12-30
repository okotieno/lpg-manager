// libs/backend/order/src/lib/listeners/order-events-listener.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderEvent } from '../events/order.event';
import { ActivityLogBackendService } from '@lpg-manager/activity-log-service';
import { NotificationService } from '@lpg-manager/notification-service';
import { UserService } from '@lpg-manager/user-service';
import { RoleService } from '@lpg-manager/role-service';
import { RoleModel } from '@lpg-manager/db';

@Injectable()
export class OrderEventsListener {
  constructor(
    private activityLogService: ActivityLogBackendService,
    private notificationService: NotificationService,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  private async notifyStationUsers(stationId: string, notification: { title: string; description: string }) {
    try {
      // Get users with roles for this station
      const stationUsers = await this.userService.model.findAll({
        include: [{
          model: RoleModel,
          where: {
            stationId: stationId
          }
        }]
      });

      if (stationUsers.length) {
        const userIds = stationUsers.map(user => user.id);

        // Create notification
        const notif = await this.notificationService.create({
          title: notification.title,
          description: notification.description
        });

        // Add users to notification
        await this.notificationService.addUsers(notif.id, userIds);
      }
    } catch (error) {
      Logger.error(`Failed to notify station users: ${error}`);
    }
  }

  @OnEvent('order.created')
  async handleOrderCreated(event: OrderEvent) {
    const order = event.order;

    // Create activity log
    const activity = await this.activityLogService.create({
      action: 'order.created',
      description: `New order #${order.id.slice(-8)} created`,
      type: 'INFO',
    });

    // Notify depot users
    await this.notifyStationUsers(order.depotId, {
      title: 'New Order Received',
      description: `Order #${order.id.slice(-8)} has been created for ${order.totalPrice.toFixed(2)} LPG units`
    });

    // Notify dealer users
    await this.notifyStationUsers(order.dealerId, {
      title: 'Order Placed Successfully',
      description: `Your order #${order.id.slice(-8)} has been placed successfully`
    });
  }

  @OnEvent('order.confirmed')
  async handleOrderConfirmed(event: OrderEvent) {
    const order = event.order;

    // Create activity log
    const activity = await this.activityLogService.create({
      action: 'order.confirmed',
      description: `Order #${order.id.slice(-8)} confirmed for dispatch`,
      type: 'INFO',
    });

    // Notify dealer users
    await this.notifyStationUsers(order.dealerId, {
      title: 'Order Confirmed for Dispatch',
      description: `Order #${order.id.slice(-8)} has been confirmed and will be dispatched soon`
    });

    // Notify depot users
    await this.notifyStationUsers(order.depotId, {
      title: 'Order Marked for Dispatch',
      description: `Order #${order.id.slice(-8)} has been marked for dispatch`
    });
  }

  @OnEvent('order.completed')
  async handleOrderCompleted(event: OrderEvent) {
    const order = event.order;

    // Create activity log
    const activity = await this.activityLogService.create({
      action: 'order.completed',
      description: `Order #${order.id.slice(-8)} completed`,
      type: 'INFO',
    });

    // Notify dealer users
    await this.notifyStationUsers(order.dealerId, {
      title: 'Order Completed',
      description: `Order #${order.id.slice(-8)} has been marked as completed`
    });

    // Notify depot users
    await this.notifyStationUsers(order.depotId, {
      title: 'Order Completed',
      description: `Order #${order.id.slice(-8)} has been completed successfully`
    });
  }

  @OnEvent('order.canceled')
  async handleOrderCanceled(event: OrderEvent) {
    const order = event.order;

    // Create activity log
    const activity = await this.activityLogService.create({
      action: 'order.canceled',
      description: `Order #${order.id.slice(-8)} canceled`,
      type: 'WARNING',
    });

    // Notify dealer users
    await this.notifyStationUsers(order.dealerId, {
      title: 'Order Canceled',
      description: `Order #${order.id.slice(-8)} has been canceled`
    });

    // Notify depot users
    await this.notifyStationUsers(order.depotId, {
      title: 'Order Canceled',
      description: `Order #${order.id.slice(-8)} has been canceled`
    });
  }
}