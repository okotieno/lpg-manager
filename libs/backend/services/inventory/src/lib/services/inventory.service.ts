import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { BrandModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class InventoryService extends CrudAbstractService<BrandModel> {
  constructor(
    @InjectModel(BrandModel) inventoryModel: typeof BrandModel,
  ) {
    super(inventoryModel);
  }
}
