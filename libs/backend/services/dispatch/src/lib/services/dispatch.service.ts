import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { DispatchModel, OrderModel, OrderItemModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DispatchStatus } from '@lpg-manager/db';
import { DriverInventoryService } from '@lpg-manager/inventory-service';
import { DriverInventoryStatus } from '@lpg-manager/db';

@Injectable()
export class DispatchService extends CrudAbstractService<DispatchModel> {
  constructor(
    @InjectModel(DispatchModel) private dispatchModel: typeof DispatchModel,
    @InjectModel(OrderModel) private orderModel: typeof OrderModel,
    private eventEmitter: EventEmitter2,
    private driverInventoryService: DriverInventoryService
  ) {
    super(dispatchModel);
  }

  override async create(data: {
    transporterId: string;
    driverId: string;
    vehicleId: string;
    dispatchDate: Date;
    orderIds: string[];
  }) {
    return this.dispatchModel.sequelize?.transaction(
      async (transaction: Transaction) => {
        // Create the dispatch record
        const dispatch = await super.model.create(
          {
            transporterId: data.transporterId,
            driverId: data.driverId,
            vehicleId: data.vehicleId,
            dispatchDate: data.dispatchDate,
          },
          { transaction }
        );

        // Update orders with the dispatch ID and status
        await this.orderModel.update(
          {
            dispatchId: dispatch.id,
            status: 'DELIVERING',
          },
          {
            where: { id: data.orderIds },
            transaction,
          }
        );

        // Emit event for each order
        for (const orderId of data.orderIds) {
          const order = await this.orderModel.findByPk(orderId);
          if (order) {
            this.eventEmitter.emit('order.confirmed', { order });
          }
        }

        return dispatch;
      }
    ) as Promise<DispatchModel>;
  }

  async scanConfirm(
    dispatchId: string,
    scannedCanisters: string[],
    dispatchStatus: DispatchStatus,
    driverInventories: { id: string }[],
    driverInventoryStatus: DriverInventoryStatus
  ) {
    const transaction = await this.dispatchModel.sequelize?.transaction();

    try {
      const dispatch = await this.dispatchModel.findByPk(dispatchId, {
        include: [
          {
            model: OrderModel,
            include: [OrderItemModel],
          },
        ],
        transaction,
      });

      if (!dispatch) {
        throw new NotFoundException(
          `Dispatch with ID "${dispatchId}" not found`
        );
      }

      // Validate quantities...

      // Assign canisters to driver
      if (dispatchStatus === DispatchStatus.DEPOT_TO_DRIVER_CONFIRMED) {
        await this.driverInventoryService.assignToDriver({
          driverId: dispatch.driverId,
          dispatchId: dispatch.id,
          inventoryItemIds: scannedCanisters,
        });
      }

      // Update driver inventory status
      if (dispatchStatus === DispatchStatus.DRIVER_FROM_DEPOT_CONFIRMED) {
        await this.driverInventoryService.updateStatus(
          dispatch.driverId,
          scannedCanisters,
          DriverInventoryStatus.IN_TRANSIT
        );
      }

      // Update dispatch status

      if (
        dispatchStatus === DispatchStatus.DRIVER_FROM_DEPOT_CONFIRMED ||
        dispatchStatus === DispatchStatus.DEPOT_TO_DRIVER_CONFIRMED
      ) {
        await dispatch.update(
          {
            status: dispatchStatus,
            ...(dispatchStatus === DispatchStatus.DEPOT_TO_DRIVER_CONFIRMED
              ? { depotToDriverConfirmedAt: new Date() }
              : { driverFromDepotConfirmedAt: new Date() }),
          },
          { transaction }
        );
      }

      if (dispatchStatus === DispatchStatus.IN_TRANSIT) {
        await this.driverInventoryService.updateStatus(
          dispatch.driverId,
          [],
          driverInventoryStatus,
          driverInventories.map((di) => di.id)
        );
      }

      await transaction?.commit();
      return dispatch;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }
}
