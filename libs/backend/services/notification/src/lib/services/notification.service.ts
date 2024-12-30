import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { NotificationModel, NotificationUserModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

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
      userIds: number[];
    }>,
  ) {
    super(notificationModel);
  }

  async sendNotification(
    title: string,
    description: string,
    userIds: number[],
  ) {
    await this.sendNotificationQueue.add({ title, description, userIds });
  }

  async addUsers(notificationId: string, userIds: string[]) {
    await this.notificationUserModel.bulkCreate(
      userIds.map((userId) => ({
        userId,
        notificationId,
      })),
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
}
