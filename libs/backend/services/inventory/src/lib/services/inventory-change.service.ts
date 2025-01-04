import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import {
  InventoryChangeModel,
} from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class InventoryChangeService extends CrudAbstractService<InventoryChangeModel> {
  override globalSearchFields = [];

  constructor(
    @InjectModel(InventoryChangeModel) inventoryChangeModel: typeof InventoryChangeModel,
  ) {
    super(inventoryChangeModel);
  }

}
