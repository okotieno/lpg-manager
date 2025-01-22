import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import {
  CatalogueModel,
  InventoryModel,
  InventoryChangeModel,
  InventoryChangeType,
  IQueryParam,
  InventoryItemModel,
  InventoryItemStatus,
  ReferenceType
} from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Transaction } from 'sequelize';

@Injectable()
export class InventoryService extends CrudAbstractService<InventoryModel> {
  override globalSearchFields = [];

  constructor(
    @InjectModel(InventoryModel) inventoryModel: typeof InventoryModel,
    @InjectModel(InventoryChangeModel) private inventoryChangeModel: typeof InventoryChangeModel,
    @InjectModel(InventoryItemModel) private inventoryItemModel: typeof InventoryItemModel
  ) {
    super(inventoryModel);
  }

  async createOrUpdateInventory(data: {
    catalogueId: string;
    stationId: string;
    quantity: number;
    reason?: string;
    userId: string;
    batchNumber: string;
    manufactureDate?: Date;
    expiryDate?: Date;
    serialNumbers?: string[];
  }) {
    const transaction = await this.model.sequelize?.transaction();
    try {
      // Check if inventory exists
      let inventory = await this.model.findOne({
        where: {
          catalogueId: data.catalogueId,
          stationId: data.stationId,
        },
        transaction,
      });

      if (inventory) {
        // Update existing inventory
        const oldQuantity = Number(inventory.quantity);
        const newQuantity = oldQuantity + Number(data.quantity);

        await inventory.update(
          { quantity: newQuantity },
          { transaction }
        );
      } else {
        // Create new inventory
        inventory = await this.model.create(
          {
            catalogueId: data.catalogueId,
            stationId: data.stationId,
            quantity: data.quantity,
          },
          { transaction }
        );
      }

      // Track inventory change
      const inventoryChange = await this.inventoryChangeModel.create(
        {
          inventoryId: inventory.id,
          userId: data.userId,
          quantity: data.quantity,
          type: InventoryChangeType.INCREASE,
          reason: data.reason,
          referenceType: ReferenceType.MANUAL,
        },
        { transaction }
      );


      // Create individual inventory items
      const items = Array.from({ length: data.quantity }).map((_, index) => ({
        inventoryId: inventory.id,
        inventoryChangeId: inventoryChange.id,
        serialNumber: data.serialNumbers?.[index],
        batchNumber: data.batchNumber,
        status: InventoryItemStatus.AVAILABLE,
        manufactureDate: data.manufactureDate,
        expiryDate: data.expiryDate,
        createdBy: data.userId,
      }));

      await this.inventoryItemModel.bulkCreate(items, { transaction });

      await transaction?.commit();
      return inventoryChange;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async updateItemStatus(
    itemId: string,
    status: InventoryItemStatus,
    userId: string,
    referenceType: ReferenceType,
    referenceId?: string,
    reason?: string
  ) {
    const transaction = await this.model.sequelize?.transaction();
    try {
      const item = await this.inventoryItemModel.findByPk(itemId, { transaction });
      if (!item) {
        throw new Error('Item not found');
      }

      const oldStatus = item.status;
      await item.update({ status }, { transaction });

      // Track the change
      await this.inventoryChangeModel.create(
        {
          inventoryId: item.inventoryId,
          userId,
          quantity: 1,
          type: status === InventoryItemStatus.AVAILABLE ? InventoryChangeType.INCREASE : InventoryChangeType.DECREASE,
          reason: reason || `Status changed from ${oldStatus} to ${status}`,
          referenceType,
          referenceId,
        },
        { transaction }
      );

      await transaction?.commit();
      return item;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async getInventoryItems(
    inventoryId: string,
    status?: InventoryItemStatus,
    batchNumber?: string
  ) {
    const where: any = { inventoryId };
    if (status) {
      where.status = status;
    }
    if (batchNumber) {
      where.batchNumber = batchNumber;
    }

    return this.inventoryItemModel.findAll({
      where,
      include: [
        {
          model: InventoryModel,
          include: ['catalogue'],
        },
      ],
    });
  }

  override async findAll(
    query: IQueryParam,
    include?: Includeable | Includeable[]
  ): Promise<{
    meta: { totalItems: number };
    items: InventoryModel[];
  }> {
    const includes = Array.isArray(include)
      ? include
      : include
      ? [include]
      : [];
    if (query.searchTerm) {
      includes.push({
        model: CatalogueModel,
        where: {
          [Op.and]: {
            name: {
              [Op.iLike]: `%${query.searchTerm}%`,
            },
          },
        },
      });
    }
    return super.findAll(query, includes);
  }
}
