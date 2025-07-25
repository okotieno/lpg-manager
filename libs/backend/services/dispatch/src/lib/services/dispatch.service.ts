import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import {
  CatalogueModel,
  ConsolidatedOrderModel,
  DispatchModel, InventoryChangeModel, InventoryChangeType,
  InventoryItemModel,
  InventoryModel,
  OrderItemModel,
  OrderModel, ReferenceType,
  StationModel
} from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DriverInventoryService } from '@lpg-manager/inventory-service';
import {
  IConsolidatedOrderStatus,
  IDispatchStatus,
  IDriverInventoryStatus,
  IScanAction,
} from '@lpg-manager/types';

@Injectable()
export class DispatchService extends CrudAbstractService<DispatchModel> {
  constructor(
    @InjectModel(DispatchModel) private dispatchModel: typeof DispatchModel,
    @InjectModel(OrderModel) private orderModel: typeof OrderModel,
    @InjectModel(InventoryItemModel)
    private inventoryItemModel: typeof InventoryItemModel,
    @InjectModel(InventoryModel) private inventoryModel: typeof InventoryModel,
    @InjectModel(InventoryChangeModel) private inventoryChangeModel: typeof InventoryChangeModel,
    @InjectModel(ConsolidatedOrderModel)
    private consolidatedOrderModel: typeof ConsolidatedOrderModel,
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

        // Get all orders with their dealer information
        const orders = await this.orderModel.findAll({
          where: { id: data.orderIds },
          include: [{ model: StationModel, as: 'dealer' }],
          transaction,
        });

        // Group orders by dealer
        const ordersByDealer = orders.reduce((acc, order) => {
          const dealerId = order.dealerId;
          if (!acc[dealerId]) {
            acc[dealerId] = [];
          }
          acc[dealerId].push(order);
          return acc;
        }, {} as Record<string, OrderModel[]>);

        // Create consolidated orders
        for (const [dealerId, dealerOrders] of Object.entries(ordersByDealer)) {
          // Create consolidated order
          const consolidatedOrder = await this.consolidatedOrderModel.create(
            {
              dispatchId: dispatch.id,
              dealerId,
            },
            { transaction }
          );

          // Update orders with dispatch ID and status
          await this.orderModel.update(
            {
              dispatchId: dispatch.id,
              status: 'DELIVERING',
              consolidatedOrderId: consolidatedOrder.id,
            },
            {
              where: { id: dealerOrders.map((order) => order.id) },
              transaction,
            }
          );
        }

        // Emit events for each order
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
    dealer,
  }: // dispatchStatus,
  // driverInventories,
  // driverInventoryStatus,
  {
    dispatchId: string;
    inventoryItems: { id: string }[];
    scanAction: IScanAction;
    dealer?: { id: string };
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
          updates.status = IDispatchStatus.Initiated;
          await this.driverInventoryService.assignToDriver({
            driverId: dispatch.driverId,
            dispatchId: dispatch.id,
            inventoryItemIds: inventoryItems.map(({ id }) => id),
            status: IDriverInventoryStatus.Assigned,
          });
          break;
        //
        case IScanAction.DriverFromDepotConfirmed:
          updates.driverFromDepotConfirmedAt = new Date();
          updates.status = IDispatchStatus.Delivering;
          await this.driverInventoryService.updateStatus(
            dispatch.driverId,
            inventoryItems.map(({ id }) => id),
            IDriverInventoryStatus.Delivering
          );
          break;
        case IScanAction.DriverToDealerConfirmed:
          {
            const consolidatedOrderModel =
              (await this.consolidatedOrderModel.findOne({
                where: {
                  dealerId: dealer?.id as string,
                  dispatchId: dispatch.id,
                },
              })) as ConsolidatedOrderModel;
            consolidatedOrderModel.status =
              IConsolidatedOrderStatus.DriverToDealerConfirmed;
            await consolidatedOrderModel.save({ transaction });
            await this.driverInventoryService.updateStatus(
              dispatch.driverId,
              inventoryItems.map(({ id }) => id),
              IDriverInventoryStatus.DriverToDealerConfirmed
            );
          }
          break;
        case IScanAction.DealerFromDriverConfirmed: {
          // ... existing code ...

          await this.driverInventoryService.updateStatus(
            dispatch.driverId,
            inventoryItems.map(({ id }) => id),
            IDriverInventoryStatus.DealerFromDriverConfirmed
          );

          // Create dealer inventory records for the scanned items
          const inventoryItemsCreated = await this.inventoryItemModel.findAll({
            where: {
              id: inventoryItems.map(({ id }) => id),
            },
            include: [
              {
                model: InventoryModel,
                include: [CatalogueModel],
              },
            ],
            transaction,
          });

          // Group items by catalogue for bulk inventory creation
          const itemsByCatalogue = inventoryItemsCreated.reduce((acc, item) => {
            const catalogueId = item.inventory?.catalogueId;
            if (!catalogueId) return acc;

            if (!acc[catalogueId]) {
              acc[catalogueId] = {
                count: 0,
                catalogueId,
              };
            }
            acc[catalogueId].count++;
            return acc;
          }, {} as Record<string, { count: number; catalogueId: string }>);

          // Create or update dealer inventory records and track changes
          for (const catalogueId in itemsByCatalogue) {
            const existingInventory = await this.inventoryModel.findOne({
              where: {
                stationId: dealer?.id,
                catalogueId,
              },
              transaction,
            });

            if (existingInventory) {
              await existingInventory.increment('quantity', {
                by: itemsByCatalogue[catalogueId].count,
                transaction,
              });

              // Record inventory change
              await this.inventoryChangeModel.create(
                {
                  inventoryId: existingInventory.id,
                  userId: dispatch.driverId, // Using driver ID as the user who made the change
                  quantity: itemsByCatalogue[catalogueId].count,
                  type: InventoryChangeType.INCREASE,
                  reason: `Received from dispatch #${dispatch.id}`,
                  referenceType: ReferenceType.DISPATCH,
                  referenceId: dispatch.id,
                },
                { transaction }
              );
            } else {
              const newInventory = await this.inventoryModel.create(
                {
                  stationId: dealer?.id,
                  catalogueId,
                  quantity: itemsByCatalogue[catalogueId].count,
                },
                { transaction }
              );

              // Record inventory change for new inventory
              await this.inventoryChangeModel.create(
                {
                  inventoryId: newInventory.id,
                  userId: dispatch.driverId,
                  quantity: itemsByCatalogue[catalogueId].count,
                  type: InventoryChangeType.INCREASE,
                  reason: `Initial stock from dispatch #${dispatch.id}`,
                  referenceType: ReferenceType.DISPATCH,
                  referenceId: dispatch.id,
                },
                { transaction }
              );
            }
          }
          break;
        }
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
