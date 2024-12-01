import { ActivityLogModel } from '@lpg-manager/db';

export class ActivityLogDeletedEvent {
  constructor(public activityLog: ActivityLogModel) {}
}
