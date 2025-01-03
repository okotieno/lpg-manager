import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DriverModel, IQueryParam, VehicleModel } from '@lpg-manager/db';
import { DriverService } from '@lpg-manager/driver-service';
import { TransporterService } from '@lpg-manager/transporter-service';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { CreateDriverInputDto } from '../dto/create-driver-input.dto';
import { UpdateDriverInputDto } from '../dto/update-driver-input.dto';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { UserService } from '@lpg-manager/user-service';

@Resolver(() => DriverModel)
export class DriverResolver {
  constructor(
    private driverService: DriverService,
    private transporterService: TransporterService,
    private userService: UserService
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateDriver)
  async createDriver(@Args('params') params: CreateDriverInputDto) {
    const driver = await this.driverService.create(params);
    if (params.vehicles?.length) {
      await driver.$set('vehicles', params.vehicles);
    }

    return {
      message: 'Successfully created driver',
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
    @Args('params') params: UpdateDriverInputDto
  ) {
    const driver = await this.driverService.update({ id, params });
    if (params.vehicles) {
      await driver.$set('vehicles', params.vehicles);
    }

    return {
      message: 'Successfully updated driver',
      data: driver,
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

  @ResolveField('user')
  async getDriverName(@Root() driver: DriverModel) {
    return this.userService.findById(driver.userId);
  }

  @ResolveField('vehicles')
  async getVehicles(@Root() driver: DriverModel) {
    const driverWithVehicles = await this.driverService.findById(driver.id, {
      include: [VehicleModel],
    });
    return driverWithVehicles?.vehicles || [];
  }
}
