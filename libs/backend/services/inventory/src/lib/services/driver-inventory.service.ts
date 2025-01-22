import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { DriverInventoryModel, InventoryItemModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { IDriverInventoryStatus } from '@lpg-manager/types';

@Injectable()
export class DriverInventoryService extends CrudAbstractService<DriverInventoryModel> {
  constructor(
    @InjectModel(DriverInventoryModel)
    private driverInventoryModel: typeof DriverInventoryModel,
    @InjectModel(InventoryItemModel)
    private inventoryItemModel: typeof InventoryItemModel
  ) {
    super(driverInventoryModel);
  }

  async assignToDriver(params: {
    driverId: string;
    dispatchId: string;
    inventoryItemIds: string[];
    status: IDriverInventoryStatus;
  }) {
    const transaction =
      await this.driverInventoryModel.sequelize?.transaction();

    try {
      const assignments = await Promise.all(
        params.inventoryItemIds.map((itemId) =>
          this.driverInventoryModel.create(
            {
              driverId: params.driverId,
              dispatchId: params.dispatchId,
              inventoryItemId: itemId,
              status: IDriverInventoryStatus.Assigned,
              assignedAt: new Date(),
            },
            { transaction }
          )
        )
      );

      await transaction?.commit();
      return assignments;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async updateStatus(
    driverId: string,
    inventoryItemIds: string[],
    status: IDriverInventoryStatus,
    driverInventoryIds: string[] = []
  ) {
    const transaction =
      await this.driverInventoryModel.sequelize?.transaction();

    try {
      if (driverInventoryIds.length > 0) {
        await this.driverInventoryModel.update(
          {
            status,
            ...(status === IDriverInventoryStatus.Returned
              ? { returnedAt: new Date() }
              : {}),
          },
          {
            where: {
              driverId,
              id: driverInventoryIds,
              status: {
                [Op.ne]: IDriverInventoryStatus.Returned,
              },
            },
            transaction,
          }
        );
      } else if (inventoryItemIds.length > 0) {
        await this.driverInventoryModel.update(
          {
            status,
            ...(status === IDriverInventoryStatus.Returned
              ? { returnedAt: new Date() }
              : {}),
            ...(status === IDriverInventoryStatus.DriverToDealerConfirmed
              ? { driverToDealerConfirmedAt: new Date() }
              : {}),
            ...(status === IDriverInventoryStatus.DealerFromDriverConfirmed
              ? { dealerFromDriverConfirmedAt: new Date() }
              : {}),
          },
          {
            where: {
              driverId,
              inventoryItemId: inventoryItemIds,
              status: {
                [Op.ne]: IDriverInventoryStatus.Returned,
              },
            },
            transaction,
          }
        );
      }

      await transaction?.commit();
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async getDriverInventory(driverId: string) {
    return this.driverInventoryModel.findAll({
      where: {
        driverId,
        status: {
          [Op.ne]: IDriverInventoryStatus.Returned,
        },
      },
      include: [
        {
          model: InventoryItemModel,
          include: ['inventory'],
        },
      ],
    });
  }

  async trackEmptyCanisters({
    driverId,
    dispatchId,
    canisterIds,
    status,
  }: {
    driverId: string;
    dispatchId: string;
    canisterIds: string[];
    status: IDriverInventoryStatus;
  }) {
    const transaction =
      await this.driverInventoryModel.sequelize?.transaction();

    try {
      // Create driver inventory records for empty canisters
      await Promise.all(
        canisterIds.map((canisterId) =>
          this.driverInventoryModel.create(
            {
              driverId,
              dispatchId,
              inventoryItemId: canisterId,
              status,
              isEmptyCanister: true, // Flag to identify empty canister records
            },
            { transaction }
          )
        )
      );

      await transaction?.commit();
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }
}
