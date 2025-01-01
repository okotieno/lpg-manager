import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Root,
} from '@nestjs/graphql';
import { Body, UseGuards } from '@nestjs/common';
import {
  TransporterModel,
  IQueryParam,
  QueryOperatorEnum,
  SortByDirectionEnum,
} from '@lpg-manager/db';
import { TransporterService } from '@lpg-manager/transporter-service';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { ValidationPipe } from '@nestjs/common';
import { CreateTransporterInputDto } from '../dto/create-transporter-input.dto';
import { UpdateTransporterInputDto } from '../dto/update-transporter-input.dto';
import {
  PermissionGuard,
  PermissionsEnum,
  Permissions,
} from '@lpg-manager/permission-service';
import { DriverService } from '@lpg-manager/driver-service';
import { VehicleService } from '@lpg-manager/vehicle-service';
import { UserService } from '@lpg-manager/user-service';

@Resolver(() => TransporterModel)
export class TransporterResolver {
  constructor(
    private transporterService: TransporterService,
    private driverService: DriverService,
    private userService: UserService,
    private vehicleService: VehicleService
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateTransporter)
  async createTransporter(@Body('params') params: CreateTransporterInputDto) {
    const transporter = await this.transporterService.create({
      name: params.name,
      contactPerson: params.contactPerson,
      contactNumber: params.contactNumber,
    });

    // Create vehicles
    if (params.vehicles?.length) {
      await Promise.all(
        params.vehicles.map((vehicle) =>
          this.vehicleService.create({
            ...vehicle,
            transporterId: transporter.id,
          })
        )
      );
    }
    // Create drivers with user accounts
    if (params.drivers?.length) {
      await Promise.all(
        params.drivers.map(async (driver) => {
          // Create user account
          const user = await this.userService.create({
            email: driver.email,
            firstName: driver.name.split(' ')[0],
            lastName: driver.name.split(' ')[1],
            phoneNumber: driver.contactNumber,
            role: 'DRIVER',
            password: Math.random().toString(36).slice(-8), // Generate random password
          });

          // Create driver record
          await this.driverService.create({
            userId: user.id,
            transporterId: transporter.id,
            licenseNumber: driver.licenseNumber,
          });
        })
      );
    }

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
    await this.transporterService.update({ id, params });

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
    return this.driverService.model.findAll({
      where: { transporterId: transporter.id },
    });
  }

  @ResolveField('vehicles')
  async getVehicles(@Root() transporter: TransporterModel) {
    console.log(transporter);
    return this.vehicleService.model.findAll({
      where: { transporterId: transporter.id },
    });
  }
}
