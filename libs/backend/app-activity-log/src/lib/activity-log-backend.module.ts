import { Module } from '@nestjs/common';
import { ActivityLogModelEventsListener } from './listeners/activity-log-model-events-listener.service';
import { ActivityLogResolver } from './resolvers/activity-log.resolver';
import { AuthServiceBackendModule } from '@lpg-manager/auth-service';
import { ActivityLogUserResolver } from './resolvers/activity-log-user.resolver';
import { ActivityLogBackendServiceModule } from '@lpg-manager/activity-log-service';

@Module({
  imports: [ActivityLogBackendServiceModule, AuthServiceBackendModule],
  providers: [
    ActivityLogResolver,
    ActivityLogUserResolver,
    ActivityLogModelEventsListener,
  ],
  exports: [],
})
export class ActivityLogModule {}
