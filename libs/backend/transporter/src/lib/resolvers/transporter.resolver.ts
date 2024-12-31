import { Args, Mutation, Query, Resolver, ResolveField, Root } from '@nestjs/graphql';
import { Body, UseGuards } from '@nestjs/common';
import { TransporterModel, PermissionsEnum } from '@lpg-manager/db';
import { TransporterService } from '@lpg-manager/transporter-service';
import { DriverService } from '@lpg-manager/driver-service';
import { VehicleService } from '@lpg-manager/transporter-service';
import { JwtAuthGuard, PermissionGuard, Permissions } from '@lpg-manager/auth';
import { ValidationPipe } from '@nestjs/common';
import { CreateTransporterInputDto } from '../dto/create-transporter-input.dto';
import { UpdateTransporterInputDto } from '../dto/update-transporter-input.dto';

@Resolver(() => TransporterModel)
export class TransporterResolver {
  constructor(
    private transporterService: TransporterService,
    private driverService: DriverService,
    private transporterService: VehicleService
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateTransporter)
  async createTransporter(
    @Body('params', new ValidationPipe()) params: CreateTransporterInputDto
  ) {
    const transporter = await this.transporterService.create(params);

    return {
      message: 'Transporter created successfully',
      data: transporter,
    };
  }

  @Query()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.ViewTransporter)
  async transporters(@Args('query') query: IQueryParam) {
    return this.transporterService.findAll(query);
  }

  @Query()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.ViewTransporter)
  async transporter(@Args('id') id: string) {
    return this.transporterService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateTransporter)
  async updateTransporter(
    @Args('id') id: string,
    @Body('params', new ValidationPipe()) params: UpdateTransporterInputDto
  ) {
    await this.transporterService.updateById(id, params);

    return {
      message: 'Successfully updated transporter',
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteTransporter)
  async deleteTransporter(@Args('id') id: string) {
    await this.transporterService.deleteById(id);

    return {
      message: 'Successfully deleted transporter',
    };
  }

  @ResolveField('drivers')
  async getDrivers(@Root() transporter: TransporterModel) {
    return this.driverService.findAll({
      filters: [
        {
          field: 'transporterId',
          operator: 'equals',
          value: transporter.id,
          values: [],
        },
      ],
    });
  }

  @ResolveField('transporters')
  async getVehicles(@Root() transporter: TransporterModel) {
    return this.transporterService.findAll({
      filters: [
        {
          field: 'transporterId',
          operator: 'equals',
          value: transporter.id,
          values: [],
        },
      ],
    });
  }
}
