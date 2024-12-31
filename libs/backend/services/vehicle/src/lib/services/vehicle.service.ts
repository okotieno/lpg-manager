import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { VehicleModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class VehicleService extends CrudAbstractService<VehicleModel> {
  constructor(
    @InjectModel(VehicleModel) vehicleModel: typeof VehicleModel
  ) {
    super(vehicleModel);
  }
} 