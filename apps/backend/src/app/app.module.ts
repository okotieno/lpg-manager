import { Module } from '@nestjs/common';
import { GraphqlModule } from '@lpg-manager/graphql';
import { AuthModule } from '@lpg-manager/auth';
import { ConfigModule } from '@nestjs/config';
import { TranslationModule } from '@lpg-manager/translation';
import { DbModule } from '@lpg-manager/db';
import { AppQueueModule } from '@lpg-manager/app-queue';
import { KeyvRedisModule } from '@lpg-manager/app-cache';
import { AppEventModule } from '@lpg-manager/app-event';
import { UserModule } from '@lpg-manager/user';
import { RoleModule } from '@lpg-manager/role';
import { PermissionModule } from '@lpg-manager/permission';
import { BrandModule } from '@lpg-manager/brand';
import { FileUploadModule } from '@lpg-manager/file-upload';
import { StationModule } from '@lpg-manager/station';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphqlModule,
    AuthModule,
    TranslationModule,
    DbModule,
    AppQueueModule,
    KeyvRedisModule,
    AppEventModule,
    UserModule,
    RoleModule,
    PermissionModule,
    BrandModule,
    FileUploadModule,
    StationModule,
  ],
})
export class AppModule {}
