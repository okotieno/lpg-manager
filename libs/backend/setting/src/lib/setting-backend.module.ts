import { Module } from '@nestjs/common';
import { SettingModelEventsListener } from './listeners/setting-model-events-listener.service';
import { SettingBackendServiceModule } from '@lpg-manager/setting-backend-service';
import { SettingResolver } from './resolvers/setting.resolver';

@Module({
  imports: [SettingBackendServiceModule],
  providers: [SettingResolver, SettingModelEventsListener],
  exports: [],
})
export class SettingModule {}
