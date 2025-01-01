import { Args, Mutation, Query, Resolver, ResolveField, Root } from '@nestjs/graphql';
import { Body, UseGuards } from '@nestjs/common';
import { IQueryParam, VehicleModel } from '@lpg-manager/db';
import { VehicleService } from '@lpg-manager/vehicle-service';
import { TransporterService } from '@lpg-manager/transporter-service';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { ValidationPipe } from '@nestjs/common';
import { CreateVehicleInputDto } from '../dto/create-vehicle-input.dto';
import { UpdateVehicleInputDto } from '../dto/update-vehicle-input.dto';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';

@Resolver(() => VehicleModel)
export class VehicleResolver {
  constructor(
    private vehicleService: VehicleService,
    private transporterService: TransporterService
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateVehicle)
  async createVehicle(
    @Body('params', new ValidationPipe()) params: CreateVehicleInputDto
  ) {
    const vehicle = await this.vehicleService.create(params);

    return {
      message: 'Vehicle created successfully',
      data: vehicle,
    };
  }

  @Query()
  @UseGuards(JwtAuthGuard)
  async vehicles(@Args('query') query: IQueryParam) {

    return this.vehicleService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query()
  @UseGuards(JwtAuthGuard, PermissionGuard)

  async vehicle(@Args('id') id: string) {
    return this.vehicleService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateVehicle)
  async updateVehicle(
    @Args('id') id: string,
    @Body('params', new ValidationPipe()) params: UpdateVehicleInputDto
  ) {

    const vehicle = this.vehicleService.update({ params, id });

    return {
      message: 'Successfully updated vehicle',
      data: vehicle,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteVehicle)
  async deleteVehicle(@Args('id') id: string) {
    await this.vehicleService.deleteById(id);

    return {
      message: 'Successfully deleted vehicle',
    };
  }

  @ResolveField('transporter')
  async getTransporter(@Root() vehicle: VehicleModel) {
    return this.transporterService.findById(vehicle.transporterId);
  }
}
