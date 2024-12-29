import { Module } from '@nestjs/common';
import { CartResolver } from './resolvers/cart.resolver';
import { CartServiceModule } from '@lpg-manager/cart-service';
import { UserServiceModule } from '@lpg-manager/user-service';
import { OrderServiceModule } from '@lpg-manager/order-service';
import { CartEventsListenerService } from './listeners/cart-events-listener.service';

@Module({
  imports: [
    CartServiceModule,
    UserServiceModule,
    OrderServiceModule,
  ],
  providers: [
    CartResolver,
    CartEventsListenerService
  ],
})
export class CartModule {
}
