// libs/backend/order/src/lib/listeners/order-events-listener.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderEvent } from '../events/order.event';
import { ActivityLogBackendService } from '@lpg-manager/activity-log-service';
import { NotificationService } from '@lpg-manager/notification-service';
import { UserService } from '@lpg-manager/user-service';
import { RoleService } from '@lpg-manager/role-service';
import { RoleModel, RoleUserModel } from '@lpg-manager/db';

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
          model: RoleUserModel,
          where: {
            stationId: stationId
          }
        }]
      });

      if (stationUsers.length) {
        const userIds = stationUsers.map(user => user.id);
        await this.notificationService.sendNotification(notification.title,  notification.description, userIds)
      }
    } catch (error) {
      Logger.error(`Failed to notify station users: ${error}`);
    }
  }

  @OnEvent('order.created')
  async handleOrderCreated(event: OrderEvent) {
    const order = event.order;

    // Create activity log
    const activity = await this.activityLogService.model.create({
      action: 'order.created',
      description: `New order #${order.id.slice(-8)} created`,
      type: 'INFO',
      userId: event.userId
    });

    // Notify depot users
    await this.notifyStationUsers(order.depotId, {
      title: 'New Order Received',
      description: `Order #${order.id.slice(-8)} has been created for ${order.totalPrice} LPG units`
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
      userId: event.userId
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
      userId: event.userId
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
      userId: event.userId
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

  @OnEvent('order.rejected')
  async handleOrderRejected(event: OrderEvent) {
    const order = event.order;
    const userId = event.userId;

    // Create activity log
    const activity = await this.activityLogService.create({
      action: 'order.rejected',
      description: `Order #${order.id.slice(-8)} rejected`,
      type: 'WARNING',
      userId: event.userId
    });

    // Notify dealer users
    await this.notifyStationUsers(order.dealerId, {
      title: 'Order Rejected',
      description: `Order #${order.id.slice(-8)} has been rejected`
    });

    // Notify depot users
    await this.notifyStationUsers(order.depotId, {
      title: 'Order Rejected',
      description: `Order #${order.id.slice(-8)} has been rejected`
    });
  }

  @OnEvent('order.dispatch_initiated')
  async handleOrderDispatchInitiated(event: OrderEvent) {
    const order = event.order;

    // Create activity log
    const activity = await this.activityLogService.create({
      action: 'order.dispatch_initiated',
      description: `Order #${order.id.slice(-8)} has been added to dispatch`,
      type: 'INFO',
      userId: event.userId
    });

    // Notify dealer users
    await this.notifyStationUsers(order.dealerId, {
      title: 'Order Added to Dispatch',
      description: `Order #${order.id.slice(-8)} has been added to a dispatch and will be delivered soon`
    });

    // Notify depot users
    await this.notifyStationUsers(order.depotId, {
      title: 'Order Added to Dispatch',
      description: `Order #${order.id.slice(-8)} has been added to dispatch #${order.dispatchId}`
    });
  }
}
