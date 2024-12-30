import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationCreatedEvent } from '../events/notification-created.event';

@Injectable()
export class NotificationModelEventsListener {
  @OnEvent('notification.created')
  async handleNotificationCreated($event: NotificationCreatedEvent) {
    // console.log($event);
  }
}
