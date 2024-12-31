import { Args, Mutation, Query, Resolver, ResolveField, Root } from '@nestjs/graphql';
import { Body, UseGuards } from '@nestjs/common';
import { DriverModel, PermissionsEnum } from '@lpg-manager/db';
import { DriverService } from '@lpg-manager/driver-service';
import { TransporterService } from '@lpg-manager/transporter-service';
import { JwtAuthGuard, PermissionGuard, Permissions } from '@lpg-manager/auth';
import { ValidationPipe } from '@nestjs/common';
import { CreateDriverInputDto } from '../dto/create-driver-input.dto';
import { UpdateDriverInputDto } from '../dto/update-driver-input.dto';

@Resolver(() => DriverModel)
export class DriverResolver {
  constructor(
    private driverService: DriverService,
    private transporterService: TransporterService
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateDriver)
  async createDriver(
    @Body('params', new ValidationPipe()) params: CreateDriverInputDto
  ) {
    const driver = await this.driverService.create(params);

    return {
      message: 'Driver created successfully',
      data: driver,
    };
  }

  @Query()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.ViewDriver)
  async drivers(@Args('query') query: IQueryParam) {
    return this.driverService.findAll(query);
  }

  @Query()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.ViewDriver)
  async driver(@Args('id') id: string) {
    return this.driverService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateDriver)
  async updateDriver(
    @Args('id') id: string,
    @Body('params', new ValidationPipe()) params: UpdateDriverInputDto
  ) {
    await this.driverService.updateById(id, params);

    return {
      message: 'Successfully updated driver',
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteDriver)
  async deleteDriver(@Args('id') id: string) {
    await this.driverService.deleteById(id);

    return {
      message: 'Successfully deleted driver',
    };
  }

  @ResolveField('transporter')
  async getTransporter(@Root() driver: DriverModel) {
    return this.transporterService.findById(driver.transporterId);
  }
} 