import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('LPG_REDIS_HOST', 'localhost'),
          port: configService.get<number>('LPG_REDIS_PORT', 6379),
          // password: configService.get<string>('LPG_REDIS_PASSWORD'),
        },
      }),
    }),
  ]
})
export class AppQueueModule {}
