import { Module } from '@nestjs/common';
import {
  NotificationBackendService,
  SEND_NOTIFICATION_QUEUE,
} from './services/notification-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationModel, NotificationUserModel } from '@lpg-manager/db';
import { BullModule } from '@nestjs/bull';
import { SendNotificationConsumer } from './consumers/send-notification.consumer';
import { PubSubProviderModule } from '@lpg-manager/util';
import { NotificationUserBackendService } from './services/notification-user-backend.service';

@Module({
  imports: [
    SequelizeModule.forFeature([NotificationModel, NotificationUserModel]),
    BullModule.registerQueue({ name: SEND_NOTIFICATION_QUEUE }),
    PubSubProviderModule,
  ],
  providers: [
    NotificationBackendService,
    SendNotificationConsumer,
    NotificationUserBackendService,
  ],
  exports: [NotificationBackendService, NotificationUserBackendService],
})
export class NotificationBackendServiceModule {}
