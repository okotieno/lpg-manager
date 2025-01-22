import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { IQueryParam, TransporterModel } from '@lpg-manager/db';
import { TransporterService } from '@lpg-manager/transporter-service';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { CreateTransporterInputDto } from '../dto/create-transporter-input.dto';
import { UpdateTransporterInputDto } from '../dto/update-transporter-input.dto';
import {
  PermissionGuard,
  Permissions,
} from '@lpg-manager/permission-service';
import { IDefaultRoles, IPermissionEnum } from '@lpg-manager/types';
import { DriverService } from '@lpg-manager/driver-service';
import { VehicleService } from '@lpg-manager/vehicle-service';
import { UserService } from '@lpg-manager/user-service';
import { RoleService } from '@lpg-manager/role-service';

@Resolver(() => TransporterModel)
export class TransporterResolver {
  constructor(
    private transporterService: TransporterService,
    private driverService: DriverService,
    private userService: UserService,
    private vehicleService: VehicleService,
    private roleService: RoleService
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.CreateTransporter)
  async createTransporter(@Body('params') params: CreateTransporterInputDto) {
    const transporter = await this.transporterService.create({
      name: params.name,
      contactPerson: params.contactPerson,
      phone: params.phone,
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
            phone: driver.phone,
            password: Math.random().toString(36).slice(-8), // Generate random password
          });

          await this.roleService.assignRoleToUser(user.id as string, IDefaultRoles.Driver)

          // Create driver record
          const driverCreated = await this.driverService.model.create({
            userId: user.id,
            transporterId: transporter.id,
            licenseNumber: driver.licenseNumber,
          });

          await driverCreated.$set('vehicles', driver.vehicles);
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
  @Permissions(IPermissionEnum.ViewTransporter)
  async transporters(@Args('query') query: IQueryParam) {
    return this.transporterService.findAll(query);
  }

  @Query()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.ViewTransporter)
  async transporter(@Args('id') id: string) {
    return this.transporterService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.UpdateTransporter)
  async updateTransporter(
    @Body(new ValidationPipe()) { id, params }: UpdateTransporterInputDto
  ) {
    // Update transporter basic info
    const transporter = await this.transporterService.update({
      id,
      params: {
        name: params.name,
        contactPerson: params.contactPerson,
        phone: params.phone,
      },
    });

    // Update vehicles
    if (params.vehicles?.length) {
      // Fetch existing vehicles
      const existingVehicles = await this.vehicleService.model.findAll({
        where: { transporterId: id },
      });

      const existingVehicleIds = existingVehicles.map((vehicle) => vehicle.id);

      // Determine which vehicles to remove, update, or add
      const vehiclesToRemove = existingVehicles.filter(
        (vehicle) => !params.vehicles?.some((v) => v.id === vehicle.id)
      );
      const vehiclesToAdd = params.vehicles.filter(
        (vehicle) => !existingVehicleIds.includes(vehicle.id)
      );
      const vehiclesToUpdate = params.vehicles.filter((vehicle) =>
        existingVehicleIds.includes(vehicle.id)
      );

      // Remove deleted vehicles
      await Promise.all(
        vehiclesToRemove.map((vehicle) =>
          this.vehicleService.model.destroy({ where: { id: vehicle.id } })
        )
      );

      // Add new vehicles
      await Promise.all(
        vehiclesToAdd.map((vehicle) =>
          this.vehicleService.model.create({
            ...vehicle,
            transporterId: id,
          })
        )
      );

      // Update existing vehicles
      await Promise.all(
        vehiclesToUpdate.map((vehicle) =>
          this.vehicleService.model.update(
            { ...vehicle },
            { where: { id: vehicle.id, transporterId: id } }
          )
        )
      );
    }

    // Update drivers
    if (params.drivers?.length) {
      // Fetch existing drivers
      const existingDrivers = await this.driverService.model.findAll({
        where: { transporterId: id },
      });

      const existingDriverIds = existingDrivers.map((driver) => driver.id);

      // Determine which drivers to remove, update, or add
      const driversToRemove = existingDrivers.filter(
        (driver) => !params.drivers?.some((d) => d.id === driver.id)
      );
      const driversToAdd = params.drivers.filter(
        (driver) => !existingDriverIds.includes(driver.id)
      );
      const driversToUpdate = params.drivers.filter((driver) =>
        existingDriverIds.includes(driver.id)
      );

      // Remove deleted drivers and their user accounts
      await Promise.all(
        driversToRemove.map(async (driver) => {
          await this.userService.deleteById(driver.userId);
          await this.driverService.deleteById(driver.id);
        })
      );

      // Add new drivers with user accounts
      await Promise.all(
        driversToAdd.map(async (driver) => {
          const user = await this.userService.create({
            email: driver.email,
            firstName: driver.name.split(' ')[0],
            lastName: driver.name.split(' ')[1],
            phone: driver.phone,
            role: 'DRIVER',
            password: Math.random().toString(36).slice(-8), // Generate random password
          });

          const driverCreated = await this.driverService.create({
            userId: user.id,
            transporterId: id,
            licenseNumber: driver.licenseNumber,
          });

          await driverCreated.$set('vehicles', driver.vehicles);
        })
      );

      // Update existing drivers (if needed)
      await Promise.all(
        driversToUpdate.map(async (driver) => {
          const existingDriver = existingDrivers.find(
            (d) => d.id === driver.id
          );
          if (existingDriver) {
            // Update driver information
            await this.driverService.model.update(
              { ...driver },
              { where: { id: driver.id, transporterId: id } }
            );

            // Update user info if necessary
            const user = await this.userService.findById(existingDriver.userId);
            if (user) {
              await this.userService.update({
                id: user.id,
                params: {
                  email: driver.email,
                  firstName: driver.name.split(' ')[0],
                  lastName: driver.name.split(' ')[1],
                  phone: driver.phone,
                },
              });
            }
          }
        })
      );
    }

    return {
      message: 'Successfully updated transporter',
      data: transporter,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.DeleteTransporter)
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
    return this.vehicleService.model.findAll({
      where: { transporterId: transporter.id },
    });
  }

  @Query()
  async transporterCount() {
    const count = await this.transporterService.model.count();
    return { count };
  }
}
