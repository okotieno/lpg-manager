import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import {
  BrandModel,
  CatalogueModel,
  IQueryParam,
  QueryOperatorEnum,
  StationModel,
} from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable } from 'sequelize';

@Injectable()
export class CatalogueService extends CrudAbstractService<CatalogueModel> {
  constructor(
    @InjectModel(CatalogueModel) catalogueModel: typeof CatalogueModel,
    @InjectModel(BrandModel) private brandModel: typeof BrandModel
  ) {
    super(catalogueModel);
  }

  override async findAll(query: IQueryParam) {
    const { filters, ...restOfQuery } = query;
    const depotFilters = filters.find(({ field }) => field === 'depotId');
    const restFilters = filters.filter(({ field }) => field !== 'depotId');

    const include: Includeable | Includeable[] = [];

    if (
      depotFilters &&
      (depotFilters.value || depotFilters?.values?.length > 0)
    ) {
      const brands = await this.brandModel.findAll({
        include: [
          {
            model: StationModel,
            where: {
              id: [
                ...depotFilters.values,
                ...depotFilters.value.split(','),
              ].filter((x) => !!x),
            },
          },
        ],
      });
      if (brands.length > 0) {
        restFilters.push({
          field: 'brandId',
          value: brands.map((product) => product.id).join(','),
          values: [],
          operator: QueryOperatorEnum.In,
        });
      } else {
        return {
          meta: { totalItems: 0 },
          items: [],
        };
      }
    }

    return super.findAll(
      { ...restOfQuery, filters: [...restFilters] },
      include
    );
  }
}
