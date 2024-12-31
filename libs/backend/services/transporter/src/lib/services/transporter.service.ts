import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { TransporterModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TransporterService extends CrudAbstractService<TransporterModel> {
  constructor(
    @InjectModel(TransporterModel) transporterModel: typeof TransporterModel
  ) {
    super(transporterModel);
  }
} 