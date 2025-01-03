import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { ActivityLogModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ActivityLogBackendService extends CrudAbstractService<ActivityLogModel> {
  constructor(
    @InjectModel(ActivityLogModel)
    private activityLogModel: typeof ActivityLogModel
  ) {
    super(activityLogModel);
  }
}
