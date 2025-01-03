import { Module } from '@nestjs/common';
import { TransporterResolver } from './resolvers/transporter.resolver';
import { TransporterServiceModule } from '@lpg-manager/transporter-service';
import { DriverServiceModule } from '@lpg-manager/driver-service';
import { VehicleServiceModule } from '@lpg-manager/vehicle-service';

@Module({
  imports: [
    TransporterServiceModule,
    DriverServiceModule,
    VehicleServiceModule,
    VehicleServiceModule,
  ],
  providers: [TransporterResolver],
})
export class TransporterModule {}
