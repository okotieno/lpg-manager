import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { DriverModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class DriverService extends CrudAbstractService<DriverModel> {
  override globalSearchFields = [];
  constructor(@InjectModel(DriverModel) driverModel: typeof DriverModel) {
    super(driverModel);
  }
}
