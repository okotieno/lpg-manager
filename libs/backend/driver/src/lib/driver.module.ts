import { Module } from '@nestjs/common';
import { DriverResolver } from './resolvers/driver.resolver';
import { DriverServiceModule } from '@lpg-manager/driver-service';
import { TransporterServiceModule } from '@lpg-manager/transporter-service';

@Module({
  imports: [
    DriverServiceModule,
    TransporterServiceModule
  ],
  providers: [
    DriverResolver
  ],
})
export class DriverModule {} 