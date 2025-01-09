import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { DispatchModel, IQueryParam, UserModel } from '@lpg-manager/db';
import { DispatchService } from '@lpg-manager/dispatch-service';
import { TransporterService } from '@lpg-manager/transporter-service';
import { DriverService } from '@lpg-manager/driver-service';
import { VehicleService } from '@lpg-manager/vehicle-service';
import { OrderService } from '@lpg-manager/order-service';
import { CurrentUser, JwtAuthGuard } from '@lpg-manager/auth';
import { CreateDispatchInputDto } from '../dto/create-dispatch-input.dto';
import { UpdateDispatchInputDto } from '../dto/update-dispatch-input.dto';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@lpg-manager/permission-service';
import { ScanConfirmDto } from '../dto/scan-confirm.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Resolver(() => DispatchModel)
export class DispatchResolver {
  constructor(
    private dispatchService: DispatchService,
    private transporterService: TransporterService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private orderService: OrderService,
    private eventEmitter: EventEmitter2
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

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.ConfirmViaScanning)
  async scanConfirm(
    @Args('params') params: ScanConfirmDto,
    @CurrentUser() currentUser: UserModel
  ) {
    const dispatch = await this.dispatchService.scanConfirm(
      params.dispatchId,
      params.scannedCanisters,
      params.dispatchStatus,
      params.driverInventories,
      params.driverInventoryStatus
    );

    this.eventEmitter.emit('dispatch.completed', {
      dispatch,
      userId: currentUser.id,
    });

    return {
      message: 'Dispatch completed successfully',
      data: dispatch,
    };
  }
}
