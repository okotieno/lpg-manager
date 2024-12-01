import { Module } from '@nestjs/common';
import { PasswordResetModelEventsListener } from './listeners/password-reset-model-events-listener.service';
import { PasswordResetBackendServiceModule } from '@lpg-manager/password-reset-service';
import { PasswordResetResolver } from './resolvers/password-reset.resolver';

@Module({
  imports: [PasswordResetBackendServiceModule],
  providers: [PasswordResetResolver, PasswordResetModelEventsListener],
  exports: [],
})
export class PasswordResetModule {}
