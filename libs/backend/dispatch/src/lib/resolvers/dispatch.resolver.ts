import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { DispatchModel, IQueryParam, OrderModel, UserModel } from '@lpg-manager/db';
import { DispatchService } from '@lpg-manager/dispatch-service';
import { TransporterService } from '@lpg-manager/transporter-service';
import { DriverService } from '@lpg-manager/driver-service';
import { VehicleService } from '@lpg-manager/vehicle-service';
import { OrderService, ConsolidatedOrderService } from '@lpg-manager/order-service';
import { CurrentUser, JwtAuthGuard } from '@lpg-manager/auth';
import { CreateDispatchInputDto } from '../dto/create-dispatch-input.dto';
import { UpdateDispatchInputDto } from '../dto/update-dispatch-input.dto';
import {
  PermissionGuard,
  Permissions,
} from '@lpg-manager/permission-service';
import { IPermissionEnum } from '@lpg-manager/types';
import { ScanConfirmDto } from '../dto/scan-confirm.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IScanAction } from '@lpg-manager/types';
import { DispatchEvent } from '../events/dispatch.event';

@Resolver(() => DispatchModel)
export class DispatchResolver {
  constructor(
    private dispatchService: DispatchService,
    private transporterService: TransporterService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private orderService: OrderService,
    private consolidatedOrderService: ConsolidatedOrderService,
    private eventEmitter: EventEmitter2
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.CreateDispatch)
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
  @Permissions(IPermissionEnum.ViewDispatch)
  async dispatches(@Args('query') query: IQueryParam) {
    return this.dispatchService.findAll(query);
  }

  @Query()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.ViewDispatch)
  async dispatch(@Args('id') id: string) {
    return this.dispatchService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.UpdateDispatch)
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
  @Permissions(IPermissionEnum.DeleteDispatch)
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

  @ResolveField('consolidatedOrders')
  async getOrders(@Root() dispatch: DispatchModel) {
    return this.consolidatedOrderService.model.findAll({
      where: { dispatchId: dispatch.id },
      include: [OrderModel]
    });
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(IPermissionEnum.ConfirmViaScanning)
  async scanConfirm(
    @Args('params') params: ScanConfirmDto,
    @CurrentUser() currentUser: UserModel
  ) {
    const actions: Record<string, string> = {
      [IScanAction.DepotToDriverConfirmed]: 'dispatch.depotToDriverConfirmed',
    };

    const dispatch = await this.dispatchService.scanConfirm({
      dispatchId: params.dispatchId,
      inventoryItems: params.inventoryItems,
      scanAction: params.scanAction,
    });

    if (actions[params.scanAction]) {
      this.eventEmitter.emit(
        actions[params.scanAction],
        new DispatchEvent(dispatch, currentUser.id)
      );
    }

    return {
      message: 'Dispatch completed successfully',
      data: dispatch,
    };
  }
}
