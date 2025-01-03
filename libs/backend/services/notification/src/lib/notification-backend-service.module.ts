import { Global, Module } from '@nestjs/common';
import {
  NotificationService,
  SEND_NOTIFICATION_QUEUE,
} from './services/notification.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationModel, NotificationUserModel } from '@lpg-manager/db';
import { BullModule } from '@nestjs/bull';
import { SendNotificationConsumer } from './consumers/send-notification.consumer';
import { NotificationUserBackendService } from './services/notification-user-backend.service';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([NotificationModel, NotificationUserModel]),
    BullModule.registerQueue({ name: SEND_NOTIFICATION_QUEUE }),
  ],
  providers: [
    NotificationService,
    SendNotificationConsumer,
    NotificationUserBackendService,
  ],
  exports: [NotificationService, NotificationUserBackendService],
})
export class NotificationServiceModule {}
