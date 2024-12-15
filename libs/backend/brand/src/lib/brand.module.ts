import { Module } from '@nestjs/common';
import { BrandResolver } from './resolvers/brand.resolver';
import { BrandServiceModule } from '@lpg-manager/brand-service';
import { UserServiceModule } from '@lpg-manager/user-service';

@Module({
  imports: [
    BrandServiceModule,
    UserServiceModule
  ],
  providers: [
    BrandResolver
  ],
})
export class BrandModule {
}
