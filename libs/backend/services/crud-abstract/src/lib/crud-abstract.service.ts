import { Model, Repository } from 'sequelize-typescript';
import { paginate } from './paginate';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { FindOrCreateOptions, Includeable } from 'sequelize/types/model';
import {
  IQueryParam,
  QueryOperatorEnum,
  SortByDirectionEnum,
} from '@lpg-manager/db';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { BadRequestException } from '@nestjs/common';

export abstract class CrudAbstractService<T extends Model> {
  globalSearchFields: string[] = ['name'];
  protected repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }
  get model() {
    return this.repository;
  }
  async findAll(query: IQueryParam, include?: Includeable | Includeable[]) {
    const page = (query?.currentPage ?? 1) - 1;
    const pageSize = query?.pageSize ?? 20;
    const sortByDirection = query?.sortByDirection ?? SortByDirectionEnum.ASC;
    const sortBy = query?.sortBy ?? 'id';

    const where: WhereOptions = {};

    for (const filter of query.filters ?? []) {
      const listValues =
        filter.values && filter.values.length > 0
          ? filter.values
          : filter.value.split(',');
      if (filter.operator === QueryOperatorEnum.Equals) {
        where[filter.field] = filter.value;
      }
      if (filter.operator === QueryOperatorEnum.GreaterThan) {
        where[filter.field] = {
          [Op.gt]: filter.value,
        };
      }
      if (filter.operator === QueryOperatorEnum.LessThan) {
        where[filter.field] = {
          [Op.lt]: filter.value,
        };
      }
      if (filter.operator === QueryOperatorEnum.Contains) {
        where[filter.field] = {
          [Op.iLike]: `%${filter.value}%`,
        };
      }
      if (filter.operator === QueryOperatorEnum.In) {
        where[filter.field] = {
          [Op.in]: listValues,
        };
      }

      if (filter.operator === QueryOperatorEnum.Between) {
        where[filter.field] = {
          [Op.between]: listValues,
        };
      }
    }

    if (Number(query?.searchTerm?.length) > 0) {
      where[Op.or as unknown as string] = [];
      this.globalSearchFields.forEach((field) => {
        where[Op.or as unknown as string].push({
          [field]: { [Op.iLike]: `%${query.searchTerm}%` },
        });
      });
    }

    const { rows: items, count: totalItems } =
      await this.repository.findAndCountAll(
        paginate(
          {
            where,
            order: [[sortBy, sortByDirection]],
            include,
          },
          {
            page,
            pageSize,
          },
        ),
      );
    return {
      items,
      meta: {
        totalItems,
      },
    };
  }

  async findById(
    id?: string,
    params?: { include?: Includeable | Includeable[]; where?: WhereOptions },
  ) {
    const { where, include } = params ?? {};
    // return null;
    if (!id) {
      return null;
    }
    return this.repository.findOne({
      where: {
        ...where,
        id,
      } as WhereOptions,
      ...{ include },
    } as FindOptions<T>);
  }

  async create(
    params: T['_creationAttributes'],
    include?: Includeable | Includeable[],
    args?: { findOrCreateOptions?: FindOrCreateOptions },
  ) {
    let item: T;

    if (args && args.findOrCreateOptions) {
      [item] = await this.repository.findOrCreate(args.findOrCreateOptions);
      await item.update(params);
    } else {
      item = await this.repository.create(
        { ...params, ...args?.findOrCreateOptions?.where },
        {
          include: include,
        },
      );
    }

    return item;
  }

  async update({
    params,
    id,
  }: {
    params: T['_creationAttributes'];
    id: string;
  }) {
    const item: T = (await this.repository.findOne({
      where: { id } as WhereOptions,
    } as FindOptions<T>)) as T;
    await item.update(params);
    return item;
  }

  async deleteById(id?: number) {
    if (!id) {
      return {
        message: 'No id provided',
      };
    }
    await this.repository.destroy({
      where: {
        id,
      } as WhereOptions,
    } as FindOptions<T>);

    return true;
  }

  async bulkCreate(params: MakeNullishOptional<T['_creationAttributes']>[]) {
    return this.repository.bulkCreate(params);
  }

  async bulkDeleteById(ids: number[]) {
    await Promise.all(
      ids.map((id) =>
        this.repository.destroy({
          where: {
            id,
          } as WhereOptions,
        } as FindOptions<T>),
      ),
    );
    return true;
  }

  async validateCreatedBy(modelId?: string, userId?: string) {
    const model = await this.findById(modelId, {
      where: { createdById: userId },
    });
    if (!model) {
      throw new BadRequestException(`Record not found`);
    }
  }
}
