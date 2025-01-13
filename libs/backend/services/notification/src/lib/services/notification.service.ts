import { Injectable, Logger } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import {
  NotificationModel,
  NotificationUserModel,
  RoleUserModel,
} from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserService } from '@lpg-manager/user-service';

export const SEND_NOTIFICATION_QUEUE = 'send-notification-queue';

@Injectable()
export class NotificationService extends CrudAbstractService<NotificationModel> {
  constructor(
    @InjectModel(NotificationModel)
    private notificationModel: typeof NotificationModel,
    @InjectModel(NotificationUserModel)
    private notificationUserModel: typeof NotificationUserModel,
    @InjectQueue(SEND_NOTIFICATION_QUEUE)
    private sendNotificationQueue: Queue<{
      title: string;
      description: string;
      userIds: string[];
    }>,
    private userService: UserService,
  ) {
    super(notificationModel);
  }

  async sendNotification(
    title: string,
    description: string,
    userIds: string[]
  ) {
    await this.sendNotificationQueue.add({ title, description, userIds });
  }

  async addUsers(notificationId: string, userIds: string[]) {
    await this.notificationUserModel.bulkCreate(
      userIds.map((userId) => ({
        userId,
        notificationId,
      }))
    );
  }

  async userStats(userId: string) {
    const total = await this.notificationUserModel.count({
      where: { userId },
    });

    const unread = await this.notificationUserModel.count({
      where: { userId, isRead: false },
    });

    return {
      total,
      unread,
      read: total - unread,
    };
  }

  async notifyStationUsers(
    stationId: string,
    notification: { title: string; description: string }
  ) {
    try {
      // Get users with roles for this station
      const stationUsers = await this.userService.model.findAll({
        include: [
          {
            model: RoleUserModel,
            where: {
              stationId: stationId,
            },
          },
        ],
      });

      if (stationUsers.length) {
        const userIds = stationUsers.map((user) => user.id);
        await this.sendNotification(
          notification.title,
          notification.description,
          userIds
        );
      }
    } catch (error) {
      Logger.error(`Failed to notify station users: ${error}`);
    }
  }
}
