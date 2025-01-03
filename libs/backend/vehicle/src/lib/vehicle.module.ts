import { Module } from '@nestjs/common';
import { VehicleResolver } from './resolvers/vehicle.resolver';
import { VehicleServiceModule } from '@lpg-manager/vehicle-service';
import { TransporterServiceModule } from '@lpg-manager/transporter-service';

@Module({
  imports: [VehicleServiceModule, TransporterServiceModule],
  providers: [VehicleResolver],
})
export class VehicleModule {}
