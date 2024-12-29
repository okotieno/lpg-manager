import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { CatalogueModel, InventoryModel, IQueryParam } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op } from 'sequelize';

@Injectable()
export class InventoryService extends CrudAbstractService<InventoryModel> {
  override globalSearchFields = [];

  constructor(
    @InjectModel(InventoryModel) inventoryModel: typeof InventoryModel
  ) {
    super(inventoryModel);
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
