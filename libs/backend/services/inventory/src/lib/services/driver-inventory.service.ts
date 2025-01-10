import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import {
  DriverInventoryModel,
  DriverInventoryStatus,
  InventoryItemModel,
} from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

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
              status: DriverInventoryStatus.ASSIGNED,
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
    status: DriverInventoryStatus,
    driverInventoryIds: string[] = []
  ) {
    const transaction =
      await this.driverInventoryModel.sequelize?.transaction();

    console.log('driverId', driverId);
    console.log('status', status);

    try {
      if (driverInventoryIds.length > 0) {
        await this.driverInventoryModel.update(
          {
            status,
            ...(status === DriverInventoryStatus.RETURNED
              ? { returnedAt: new Date() }
              : {}),
          },
          {
            where: {
              driverId,
              id: driverInventoryIds,
              status: {
                [Op.ne]: DriverInventoryStatus.RETURNED,
              },
            },
            transaction,
          }
        );
      } else if (inventoryItemIds.length > 0) {
        await this.driverInventoryModel.update(
          {
            status,
            ...(status === DriverInventoryStatus.RETURNED
              ? { returnedAt: new Date() }
              : {}),
          },
          {
            where: {
              driverId,
              inventoryItemId: inventoryItemIds,
              status: {
                [Op.ne]: DriverInventoryStatus.RETURNED,
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
          [Op.ne]: DriverInventoryStatus.RETURNED,
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
}
