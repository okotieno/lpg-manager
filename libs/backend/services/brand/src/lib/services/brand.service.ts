import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { BrandModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class BrandService extends CrudAbstractService<BrandModel> {
  constructor(@InjectModel(BrandModel) brandModel: typeof BrandModel) {
    super(brandModel);
  }
}
