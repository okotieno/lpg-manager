import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'JWT_SECRET',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<string>('LPG_JWT_SECRET'),
    },
  ],
  exports: ['JWT_SECRET'],
})
export class JwtAuthModule {}
