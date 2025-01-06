import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { InventoryItemModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class InventoryItemService extends CrudAbstractService<InventoryItemModel> {
  override globalSearchFields = [];

  constructor(
    @InjectModel(InventoryItemModel) inventoryItemModel: typeof InventoryItemModel
  ) {
    super(inventoryItemModel);
  }
}
