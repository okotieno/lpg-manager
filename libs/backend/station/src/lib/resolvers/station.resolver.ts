import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateStationInputDto } from '../dto/create-station-input.dto';
import {
  Body,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { StationService } from '@lpg-manager/station-service';
import { IQueryParam, StationModel } from '@lpg-manager/db';
import { UpdateStationInputDto } from '../dto/update-station-input.dto';

@Resolver(() => StationModel)
export class StationResolver {
  constructor(private stationService: StationService) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateStation)
  async createStation(
    @Body('params', new ValidationPipe()) params: CreateStationInputDto
  ) {
    const station = await this.stationService.create({
      name: params.name,
      type: params.type,
    });

    return {
      message: 'Station created successfully',
      data: station,
    };
  }

  @Query(() => StationModel)
  stations(@Args('query') query: IQueryParam) {
    return this.stationService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => StationModel)
  async station(@Args('id') id: string) {
    return this.stationService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateStation)
  async updateStation(
    @Body(new ValidationPipe()) { id, params }: UpdateStationInputDto
  ) {
    const station = await this.stationService.findById(id);
    if (station) {
      await station.update(params);
      await station.save();

      return {
        message: 'Successfully updated station',
        data: station,
      };
    }
    throw new BadRequestException('No station found');
  }

  @Mutation(() => StationModel)
  async deleteStation(@Args('id') id: string) {
    await this.stationService.deleteById(id);

    return {
      message: 'Successfully deleted station',
    };
  }
}
