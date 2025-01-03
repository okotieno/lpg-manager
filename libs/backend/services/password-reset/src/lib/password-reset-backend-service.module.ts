import { Module } from '@nestjs/common';
import { PasswordResetBackendService } from './services/password-reset-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PasswordResetModel, UserModel } from '@lpg-manager/db';

@Module({
  imports: [SequelizeModule.forFeature([PasswordResetModel, UserModel])],
  providers: [PasswordResetBackendService],
  exports: [PasswordResetBackendService],
})
export class PasswordResetBackendServiceModule {}
