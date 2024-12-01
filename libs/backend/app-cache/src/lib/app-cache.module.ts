import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KEYV_REDIS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('LPG_REDIS_HOST', 'localhost');
        const port = configService.get<string>('LPG_REDIS_PORT', '6379');
        const password = configService.get<string>('LPG_REDIS_PASSWORD', '');

        const redisUri = password
          ? `redis://:${password}@${host}:${port}`
          : `redis://${host}:${port}`;

        return new Keyv({
          store: new KeyvRedis(redisUri),
        });
      },
    },
  ],
  exports: ['KEYV_REDIS'],
})
export class KeyvRedisModule {}
