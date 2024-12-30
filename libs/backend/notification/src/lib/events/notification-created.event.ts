import { NotificationModel } from '@lpg-manager/db';

export class NotificationCreatedEvent {
  constructor(public notification: NotificationModel) {}
}
