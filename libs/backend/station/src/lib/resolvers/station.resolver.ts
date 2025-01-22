import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { CreateStationInputDto } from '../dto/create-station-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '@lpg-manager/auth';
import {
  PermissionGuard,
  Permissions,
} from '@lpg-manager/permission-service';
import { IPermissionEnum } from '@lpg-manager/types';
import { StationService } from '@lpg-manager/station-service';
import { IQueryParam, StationModel } from '@lpg-manager/db';
import { UpdateStationInputDto } from '../dto/update-station-input.dto';
// import { BrandModel } from '@lpg-manager/db';
// import { InjectModel } from '@nestjs/sequelize';

@Resolver(() => StationModel)
export class StationResolver {
  constructor(
    private stationService: StationService
  ) // @InjectModel(BrandModel) private brandModel: typeof BrandModel
  {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.CreateStation)
  async createStation(
    @Body('params', new ValidationPipe()) params: CreateStationInputDto
  ) {
    const station = await this.stationService.create({
      name: params.name,
      type: params.type,
    });

    if (params.type === 'DEPOT' && params.brands?.length) {
      await station.$set(
        'brands',
        params.brands.map(({ id }) => id)
      );
    }

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
  @Permissions(IPermissionEnum.UpdateStation)
  async updateStation(
    @Body(new ValidationPipe()) { id, params }: UpdateStationInputDto
  ) {
    const station = await this.stationService.findById(id);
    if (station) {
      await station.update(params);
      await station.save();

      if (station.type === 'DEPOT' && params.brands?.length) {
        await station.$set(
          'brands',
          params.brands.map(({ id }) => id)
        );
      }

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

  @ResolveField('brands')
  async getBrands(@Root() station: StationModel) {
    if (station.type === 'DEPOT') {
      return station.$get('brands');
    }
    return [];
  }

  @Query()
  async stationCount() {
    const count = await this.stationService.model.count();
    return { count };
  }
}
