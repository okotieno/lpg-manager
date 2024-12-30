import { Routes } from '@nestjs/core';
import { AuthModule } from './auth-backend.module';
import { UserServiceModule } from '@lpg-manager/user-service';
import { OtpBackendServiceModule } from '@lpg-manager/otp-service';
import { PasswordResetBackendServiceModule } from '@lpg-manager/password-reset-service';

export const authRoutes: Routes = [
  {
    path: 'auth',
    module: AuthModule,
    children: [
      {
        path: 'users',
        module: UserServiceModule,
      },
      {
        path: 'otp',
        module: OtpBackendServiceModule,
      },
      {
        path: 'password-reset',
        module: PasswordResetBackendServiceModule,
      },
    ],
  },
];
