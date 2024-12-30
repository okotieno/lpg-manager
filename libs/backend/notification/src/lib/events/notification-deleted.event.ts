import { NotificationModel } from '@lpg-manager/db';

export class NotificationDeletedEvent {
  constructor(public notification: NotificationModel) {}
}
