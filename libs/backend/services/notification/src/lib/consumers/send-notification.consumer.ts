import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  NotificationBackendService,
  SEND_NOTIFICATION_QUEUE,
} from '../services/notification-backend.service';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from '@lpg-manager/util';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Processor(SEND_NOTIFICATION_QUEUE)
export class SendNotificationConsumer {
  constructor(
    private notificationService: NotificationBackendService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Process()
  async sendNotifications(
    job: Job<{ title: string; description: string; userIds: number[] }>,
  ): Promise<void> {
    const notification = await this.notificationService.create({
      title: job.data.title,
      description: job.data.description,
    });
    await this.notificationService.addUsers(notification.id, job.data.userIds);
    await this.pubSub.publish('notificationCreated', {
      id: notification.id,
      title: notification.title,
      description: notification.description,
      createdAt: notification.createdAt,
      userIds: job.data.userIds,
    });
  }
}
