import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { InventoryModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class InventoryService extends CrudAbstractService<InventoryModel> {
  constructor(
    @InjectModel(InventoryModel) inventoryModel: typeof InventoryModel,
  ) {
    super(inventoryModel);
  }
}

