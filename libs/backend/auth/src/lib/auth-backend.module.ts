import { Module } from '@nestjs/common';
import { AuthResolver } from './resolvers/auth.resolver';
import {
  AuthServiceBackendModule,
  JwtAuthModule,
} from '@lpg-manager/auth-service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionServiceBackendModule } from '@lpg-manager/permission-service';
import { LocalStrategy } from './strategies/local.strategy';
import { OtpBackendServiceModule } from '@lpg-manager/otp-service';
import { TranslationServiceModule } from '@lpg-manager/translation';
import { SendPasswordResetLinkConsumer } from './consumers/send-password-reset-link.consumer';
import {
  SEND_PASSWORD_RESET_OTP_QUEUE,
  SEND_VERIFICATION_LINK_QUEUE,
  SEND_WELCOME_EMAIL_QUEUE,
  SEND_PASSWORD_RESET_LINK_QUEUE,
} from './constants/queue.constants';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from '@lpg-manager/email-service';
import { AuthEventsListenerService } from './listeners/auth-events-listener.service';
import { RoleServiceBackendModule } from '@lpg-manager/role-service';
import { PasswordResetBackendServiceModule } from '@lpg-manager/password-reset-service';
import { SendEmailVerificationLinkConsumer } from './consumers/send-email-verification-link.consumer';
import { SendWelcomeEmailConsumer } from './consumers/send-welcome-email.consumer';
import { SettingBackendServiceModule } from '@lpg-manager/setting-service';
import { ActivityLogBackendServiceModule } from '@lpg-manager/activity-log-service';

@Module({
  imports: [
    AuthServiceBackendModule,
    JwtAuthModule,
    BullModule.registerQueue(
      { name: SEND_PASSWORD_RESET_OTP_QUEUE },
      { name: SEND_PASSWORD_RESET_LINK_QUEUE },
      { name: SEND_VERIFICATION_LINK_QUEUE },
      { name: SEND_WELCOME_EMAIL_QUEUE },
    ),
    PermissionServiceBackendModule,
    OtpBackendServiceModule,
    TranslationServiceModule,
    EmailModule,
    RoleServiceBackendModule,
    PasswordResetBackendServiceModule,
    SettingBackendServiceModule,
    ActivityLogBackendServiceModule
  ],
  providers: [
    AuthResolver,
    JwtStrategy,
    LocalStrategy,
    SendPasswordResetLinkConsumer,
    SendEmailVerificationLinkConsumer,
    SendWelcomeEmailConsumer,
    AuthEventsListenerService,
  ],
  exports: [],
})
export class AuthModule {}
