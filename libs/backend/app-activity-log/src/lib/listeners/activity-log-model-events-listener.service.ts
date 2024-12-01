import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivityLogCreatedEvent } from '../events/activity-log-created.event';

@Injectable()
export class ActivityLogModelEventsListener {
  @OnEvent('activity-log.created')
  async handleActivityLogCreated($event: ActivityLogCreatedEvent) {
    Logger.log('ActivityLog created event event => id', $event.activityLog.id);
  }
}
