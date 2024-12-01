import { Module } from '@nestjs/common';
import { ActivityLogModelEventsListener } from './listeners/activity-log-model-events-listener.service';
import { ActivityLogBackendServiceModule } from '@lpg-manager/activity-log-backend-service';
import { ActivityLogResolver } from './resolvers/activity-log.resolver';
import { InstitutionBackendServiceModule } from '@lpg-manager/institution-backend-service';
import { AuthServiceBackendModule } from '@lpg-manager/auth-service';
import { ActivityLogUserResolver } from './resolvers/activity-log-user.resolver';

@Module({
  imports: [
    ActivityLogBackendServiceModule,
    InstitutionBackendServiceModule,
    AuthServiceBackendModule,
  ],
  providers: [
    ActivityLogResolver,
    ActivityLogUserResolver,
    ActivityLogModelEventsListener,
  ],
  exports: [],
})
export class ActivityLogModule {}
