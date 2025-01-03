import { Module } from '@nestjs/common';
import { StationResolver } from './resolvers/station.resolver';
import { StationServiceModule } from '@lpg-manager/station-service';

@Module({
  imports: [StationServiceModule],
  providers: [StationResolver],
})
export class StationModule {}
