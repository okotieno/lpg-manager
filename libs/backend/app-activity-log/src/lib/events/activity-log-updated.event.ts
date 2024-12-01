import { ActivityLogModel } from '@lpg-manager/db';

export class ActivityLogUpdatedEvent {
  constructor(public activityLog: ActivityLogModel) {}
}
