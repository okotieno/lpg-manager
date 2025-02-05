import { Module } from '@nestjs/common';
import { CartResolver } from './resolvers/cart.resolver';
import { CartServiceModule } from '@lpg-manager/cart-service';
import { OrderServiceModule } from '@lpg-manager/order-service';
import { CartEventsListenerService } from './listeners/cart-events-listener.service';

@Module({
  imports: [CartServiceModule, OrderServiceModule],
  providers: [CartResolver, CartEventsListenerService],
})
export class CartModule {}
