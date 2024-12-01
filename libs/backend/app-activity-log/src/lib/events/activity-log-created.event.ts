import { ActivityLogModel } from '@lpg-manager/db';

export class ActivityLogCreatedEvent {
  constructor(public activityLog: ActivityLogModel) {}
}
