import { Module } from '@nestjs/common';
import { CartResolver } from './resolvers/cart.resolver';
import { CartServiceModule } from '@lpg-manager/cart-service';
import { UserServiceModule } from '@lpg-manager/user-service';

@Module({
  imports: [
    CartServiceModule,
    UserServiceModule
  ],
  providers: [
    CartResolver
  ],
})
export class CartModule {
}
