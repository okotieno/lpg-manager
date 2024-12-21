import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { CatalogueModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CatalogueService extends CrudAbstractService<CatalogueModel> {
  constructor(
    @InjectModel(CatalogueModel) catalogueModel: typeof CatalogueModel,
  ) {
    super(catalogueModel);
  }
}
