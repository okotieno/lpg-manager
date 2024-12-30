import { NotificationModel, NotificationUserModel } from '@lpg-manager/db';

export class NotificationUpdatedEvent {
  constructor(public notification: NotificationModel) {}
}

export class NotificationUSerUpdatedEvent {
  constructor(public notificationUser: NotificationUserModel) {}
}
