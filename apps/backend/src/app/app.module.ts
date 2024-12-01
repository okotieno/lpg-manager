import { Module } from '@nestjs/common';
import { GraphqlModule } from '@lpg-manager/graphql';
import { AuthModule } from '@lpg-manager/auth';
import { ConfigModule } from '@nestjs/config';
import { TranslationModule } from '@lpg-manager/translation';
import { DbModule } from '@lpg-manager/db';
import { AppQueueModule } from '@lpg-manager/app-queue';
import { KeyvRedisModule } from '@lpg-manager/app-cache';
import { AppEventModule } from '@lpg-manager/app-event';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphqlModule,
    AuthModule,
    TranslationModule,
    DbModule,
    AppQueueModule,
    KeyvRedisModule,
    AppEventModule
  ],
})
export class AppModule {}
