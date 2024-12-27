import { Module } from '@nestjs/common';
import { OrderResolver } from './resolvers/order.resolver';
import { OrderServiceModule } from '@lpg-manager/order-service';

@Module({
  imports: [
    OrderServiceModule,
  ],
  providers: [
    OrderResolver
  ],
})
export class OrderModule {
}
