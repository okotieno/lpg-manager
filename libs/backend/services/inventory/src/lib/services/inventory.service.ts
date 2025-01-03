import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { 
  CatalogueModel, 
  InventoryModel, 
  InventoryChangeModel,
  InventoryChangeType,
  IQueryParam 
} from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Transaction } from 'sequelize';

@Injectable()
export class InventoryService extends CrudAbstractService<InventoryModel> {
  override globalSearchFields = [];

  constructor(
    @InjectModel(InventoryModel) inventoryModel: typeof InventoryModel,
    @InjectModel(InventoryChangeModel) private inventoryChangeModel: typeof InventoryChangeModel
  ) {
    super(inventoryModel);
  }

  async createOrUpdateInventory(data: {
    catalogueId: string;
    stationId: string;
    quantity: number;
    reason?: string;
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
      await this.inventoryChangeModel.create(
        {
          inventoryId: inventory.id,
          quantity: data.quantity,
          type: InventoryChangeType.INCREASE,
          reason: data.reason,
        },
        { transaction }
      );

      await transaction?.commit();
      return inventory;
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
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
