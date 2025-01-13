import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { DispatchModel, OrderModel, OrderItemModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DispatchStatus } from '@lpg-manager/db';
import { DriverInventoryService } from '@lpg-manager/inventory-service';
import { DriverInventoryStatus } from '@lpg-manager/db';
import { IScanAction } from '@lpg-manager/types';

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

  async scanConfirm({
    dispatchId,
    inventoryItems,
    scanAction,
  }: // dispatchStatus,
  // driverInventories,
  // driverInventoryStatus,
  {
    dispatchId: string;
    inventoryItems: { id: string }[];
    scanAction: IScanAction;

    // scannedCanisters: string[];
    // dispatchStatus: DispatchStatus;
    // driverInventories: { id: string }[];
    // driverInventoryStatus: DriverInventoryStatus;
  }) {
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

      const updates: Partial<DispatchModel> = {};

      // Handle filled canisters flow
      switch (scanAction) {
        case IScanAction.DepotToDriverConfirmed:
          updates.depotToDriverConfirmedAt = new Date();
          await this.driverInventoryService.assignToDriver({
            driverId: dispatch.driverId,
            dispatchId: dispatch.id,
            inventoryItemIds: inventoryItems.map(({ id }) => id),
            status: DriverInventoryStatus.FILLED_ASSIGNED,
          });
          break;
        //
        //   case DispatchStatus.FILLED_DRIVER_CONFIRMED:
        //     updates.filledDriverConfirmedAt = new Date();
        //     await this.driverInventoryService.updateStatus(
        //       dispatch.driverId,
        //       scannedCanisters,
        //       DriverInventoryStatus.FILLED_IN_TRANSIT
        //     );
        //     break;
        //
        //   case DispatchStatus.FILLED_DELIVERED_TO_DEALER:
        //     updates.filledDeliveredToDealerAt = new Date();
        //     updates.isFilledDeliveryCompleted = true;
        //     await this.driverInventoryService.updateStatus(
        //       dispatch.driverId,
        //       scannedCanisters,
        //       DriverInventoryStatus.FILLED_DELIVERED
        //     );
        //     break;
        //
        //   // Handle empty canisters flow
        //   case DispatchStatus.EMPTY_COLLECTED_FROM_DEALER:
        //     updates.emptyCollectedFromDealerAt = new Date();
        //     await this.driverInventoryService.trackEmptyCanisters({
        //       driverId: dispatch.driverId,
        //       dispatchId: dispatch.id,
        //       canisterIds: scannedCanisters,
        //       status: DriverInventoryStatus.EMPTY_COLLECTED,
        //     });
        //     break;
        //
        //   case DispatchStatus.EMPTY_RETURNED_TO_DEPOT:
        //     updates.emptyReturnedToDepotAt = new Date();
        //     updates.isEmptyReturnCompleted = true;
        //     await this.driverInventoryService.updateStatus(
        //       dispatch.driverId,
        //       scannedCanisters,
        //       DriverInventoryStatus.EMPTY_RETURNED
        //     );
        //     break;
      }

      // Check if both flows are complete
      // if (updates.isFilledDeliveryCompleted && updates.isEmptyReturnCompleted) {
      //   updates.status = DispatchStatus.COMPLETED;
      // }

      await dispatch.update(updates, { transaction });
      await transaction?.commit();
      return dispatch;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }
}
