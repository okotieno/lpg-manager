import { Module } from '@nestjs/common';
import { DispatchResolver } from './resolvers/dispatch.resolver';
import { DispatchServiceModule } from '@lpg-manager/dispatch-service';
import { TransporterServiceModule } from '@lpg-manager/transporter-service';
import { DriverServiceModule } from '@lpg-manager/driver-service';
import { VehicleServiceModule } from '@lpg-manager/vehicle-service';
import { OrderServiceModule } from '@lpg-manager/order-service';
import { DispatchEventsListener } from './listeners/dispatch-events.listener';

@Module({
  imports: [
    DispatchServiceModule,
    TransporterServiceModule,
    DriverServiceModule,
    VehicleServiceModule,
    OrderServiceModule,
  ],
  providers: [
    DispatchEventsListener,
    DispatchResolver
  ],
})
export class DispatchModule {}
