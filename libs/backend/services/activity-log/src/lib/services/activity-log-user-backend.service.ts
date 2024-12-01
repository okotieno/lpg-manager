import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { ActivityLogUserModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ActivityLogUserBackendService extends CrudAbstractService<ActivityLogUserModel> {
  constructor(
    @InjectModel(ActivityLogUserModel)
    activityLogUserModel: typeof ActivityLogUserModel,
  ) {
    super(activityLogUserModel);
  }
}
