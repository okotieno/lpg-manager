import { Global, Module } from '@nestjs/common';
import { ActivityLogBackendService } from './services/activity-log-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivityLogModel, ActivityLogUserModel } from '@lpg-manager/db';
import { ActivityLogUserBackendService } from './services/activity-log-user-backend.service';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([ActivityLogModel, ActivityLogUserModel]),
  ],
  providers: [ActivityLogBackendService, ActivityLogUserBackendService],
  exports: [ActivityLogBackendService, ActivityLogUserBackendService],
})
export class ActivityLogBackendServiceModule {}
