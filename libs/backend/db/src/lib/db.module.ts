import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import {
  ActivityLogModel, ActivityLogUserModel, BrandModel,
  FileUploadModel, NotificationModel,
  OtpModel,
  PasswordResetModel,
  PermissionModel,
  RoleModel,
  RoleUserModel, SettingModel,
  UserModel
} from './models';
import { NotificationUserModel } from './models/notification-user.model';
import { SequelizeOptions } from 'sequelize-typescript';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get<SequelizeOptions['dialect']>('LPG_DATABASE_DIALECT'),
        host: configService.get('LPG_DATABASE_HOST'),
        port: configService.get('LPG_DATABASE_PORT', { infer: true }),
        username: configService.get('LPG_DATABASE_USERNAME'),
        password: configService.get('LPG_DATABASE_PASSWORD'),
        database: configService.get('LPG_DATABASE_DATABASE'),
        logging: false,
        models: [
          PermissionModel,
          RoleModel,
          UserModel,
          RoleUserModel,
          FileUploadModel,
          OtpModel,
          PasswordResetModel,
          NotificationModel,
          NotificationUserModel,
          SettingModel,
          ActivityLogModel,
          ActivityLogUserModel,
          BrandModel
        ],
      }),
    }),
  ],
})
export class DbModule {}
