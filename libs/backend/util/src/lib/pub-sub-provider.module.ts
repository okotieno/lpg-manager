import { Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const PUB_SUB = 'PUB_SUB';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new RedisPubSub({
          connection: {
            host: configService.get<string>('LPG_REDIS_HOST'),
            port: configService.get<number>('LPG_REDIS_PORT'),
          },
        }),
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubProviderModule {}
