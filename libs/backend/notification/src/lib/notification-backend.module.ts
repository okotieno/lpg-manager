import { Module } from '@nestjs/common';
import { NotificationModelEventsListener } from './listeners/notification-model-events-listener.service';
import { NotificationResolver } from './resolvers/notification.resolver';
import { NotificationUserResolver } from './resolvers/notification-user.resolver';

@Module({
  imports: [],
  providers: [
    NotificationResolver,
    NotificationModelEventsListener,
    NotificationUserResolver,
  ],
  exports: [],
})
export class NotificationModule {}
