import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import {
  DispatchModel,
  OrderModel,
  OrderItemModel,
  CatalogueModel,
  InventoryItemModel,
  InventoryModel,
} from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DispatchStatus } from '@lpg-manager/db';

@Injectable()
export class DispatchService extends CrudAbstractService<DispatchModel> {
  constructor(
    @InjectModel(DispatchModel) private dispatchModel: typeof DispatchModel,
    @InjectModel(OrderModel) private orderModel: typeof OrderModel,
    @InjectModel(OrderItemModel) private orderItemModel: typeof OrderItemModel,
    @InjectModel(InventoryItemModel)
    private inventoryItemModel: typeof InventoryItemModel,
    @InjectModel(CatalogueModel) private catalogueModel: typeof CatalogueModel,
    private eventEmitter: EventEmitter2
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
    dispatchStatus: DispatchStatus
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

      // Group scanned canisters by catalogue
      const scannedInventoryItems = await this.inventoryItemModel.findAll({
        where: { id: scannedCanisters },
        include: [
          {
            model: InventoryModel,
            include: [CatalogueModel],
          },
        ],
        transaction,
      });

      const scannedQuantities = new Map<string, number>();
      scannedInventoryItems.forEach((inventoryItem) => {
        console.log(inventoryItem);
        const current = scannedQuantities.get(inventoryItem.inventory.id) || 0;
        scannedQuantities.set(inventoryItem.inventory.id, current + 1);
      });

      // Validate quantities match order items
      for (const order of dispatch.orders) {
        for (const item of order.items) {
          const scannedQty = scannedQuantities.get(item.inventoryId) || 0;
          if (Number(scannedQty) !== Number(item.quantity)) {
            throw new BadRequestException(
              `Scanned quantity (${scannedQty}) does not match order quantity (${item.quantity}) for catalogue ${item.inventoryId}`
            );
          }
        }
      }

      // Update dispatch status and timestamp

      switch (dispatchStatus) {
        case DispatchStatus.DEPOT_TO_DRIVER_CONFIRMED:
          await dispatch.update(
            {
              depotToDriverConfirmedAt: new Date(),
              status: DispatchStatus.DEPOT_TO_DRIVER_CONFIRMED,
            },
            { transaction }
          );
          break;
        case DispatchStatus.DRIVER_FROM_DEPOT_CONFIRMED:
          await dispatch.update(
            {
              driverFromDepotConfirmedAt: new Date(),
              status: DispatchStatus.DRIVER_FROM_DEPOT_CONFIRMED,
            },
            { transaction }
          );
          break;
      }

      await transaction?.commit();

      return dispatch;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }
}
