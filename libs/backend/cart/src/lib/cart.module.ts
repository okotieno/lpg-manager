import { Module } from '@nestjs/common';
import { CartResolver } from './resolvers/cart.resolver';
import { CartServiceModule } from '@lpg-manager/cart-service';
import { UserServiceModule } from '@lpg-manager/user-service';
import { BrandServiceModule } from '@lpg-manager/brand-service';

@Module({
  imports: [
    CartServiceModule,
    UserServiceModule,
    BrandServiceModule
  ],
  providers: [
    CartResolver
  ],
})
export class CartModule {
}
