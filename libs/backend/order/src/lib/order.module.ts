import { Module } from '@nestjs/common';
import { OrderResolver } from './resolvers/order.resolver';
import { OrderServiceModule } from '@lpg-manager/order-service';
import { OrderEventsListener } from './listeners/order-events-listener.service';

@Module({
  imports: [
    OrderServiceModule,
  ],
  providers: [
    OrderResolver,
    OrderEventsListener
  ],
})
export class OrderModule {
}
