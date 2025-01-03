import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { StationModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class StationService extends CrudAbstractService<StationModel> {
  constructor(@InjectModel(StationModel) stationModel: typeof StationModel) {
    super(stationModel);
  }
}
