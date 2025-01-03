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
  DispatchModel,
  IQueryParam,
  QueryOperatorEnum,
  SortByDirectionEnum,
} from '@lpg-manager/db';
import { DispatchService } from '@lpg-manager/dispatch-service';
import { TransporterService } from '@lpg-manager/transporter-service';
import { DriverService } from '@lpg-manager/driver-service';
import { VehicleService } from '@lpg-manager/vehicle-service';
import { OrderService } from '@lpg-manager/order-service';
import { JwtAuthGuard } from '@lpg-manager/auth';
import { ValidationPipe } from '@nestjs/common';
import { CreateDispatchInputDto } from '../dto/create-dispatch-input.dto';
import { UpdateDispatchInputDto } from '../dto/update-dispatch-input.dto';
import {
  PermissionGuard,
  PermissionsEnum,
  Permissions,
} from '@lpg-manager/permission-service';

@Resolver(() => DispatchModel)
export class DispatchResolver {
  constructor(
    private dispatchService: DispatchService,
    private transporterService: TransporterService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private orderService: OrderService
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateDispatch)
  async createDispatch(
    @Body('params', new ValidationPipe()) params: CreateDispatchInputDto
  ) {
    const dispatch = await this.dispatchService.create(params);

    return {
      message: 'Dispatch created successfully',
      data: dispatch,
    };
  }

  @Query()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.ViewDispatch)
  async dispatches(@Args('query') query: IQueryParam) {
    return this.dispatchService.findAll(query);
  }

  @Query()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.ViewDispatch)
  async dispatch(@Args('id') id: string) {
    return this.dispatchService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateDispatch)
  async updateDispatch(
    @Body(new ValidationPipe()) { id, params }: UpdateDispatchInputDto
  ) {
    await this.dispatchService.update({ id, params });

    return {
      message: 'Successfully updated dispatch',
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteDispatch)
  async deleteDispatch(@Args('id') id: string) {
    await this.dispatchService.deleteById(id);

    return {
      message: 'Successfully deleted dispatch',
    };
  }

  @ResolveField('transporter')
  async getTransporter(@Root() dispatch: DispatchModel) {
    return this.transporterService.findById(dispatch.transporterId);
  }

  @ResolveField('driver')
  async getDriver(@Root() dispatch: DispatchModel) {
    return this.driverService.findById(dispatch.driverId);
  }

  @ResolveField('vehicle')
  async getVehicle(@Root() dispatch: DispatchModel) {
    return this.vehicleService.findById(dispatch.vehicleId);
  }

  @ResolveField('orders')
  async getOrders(@Root() dispatch: DispatchModel) {
    return this.orderService.model.findAll({
      where: { dispatchId: dispatch.id },
    });
  }
}
