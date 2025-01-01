import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import {
  DriverModel,
  DriverVehicleModel,
  IQueryParam,
  QueryOperatorEnum,
  StationModel,
  VehicleModel
} from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op } from 'sequelize';

@Injectable()
export class VehicleService extends CrudAbstractService<VehicleModel> {
  constructor(
    @InjectModel(VehicleModel) vehicleModel: typeof VehicleModel,
    @InjectModel(DriverVehicleModel) private driverVehicleModel: typeof DriverVehicleModel
  ) {
    super(vehicleModel);
  }

  override async findAll(query: IQueryParam) {
    const { filters, ...restOfQuery } = query;
    const driverFilters = filters.find(({ field }) => field === 'driverId');
    const restFilters = filters.filter(({ field }) => field !== 'driverId');

    const include: Includeable | Includeable[] = [];

    if (driverFilters && (driverFilters.value || driverFilters?.values.length > 0)) {
      const drivers = await this.driverVehicleModel.findAll({
        where: { driverId:  driverFilters.value },
      });
      if (drivers.length > 0) {
        restFilters.push({
          field: 'id',
          value: drivers.map((driverVehicle) => driverVehicle.vehicleId).join(','),
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
