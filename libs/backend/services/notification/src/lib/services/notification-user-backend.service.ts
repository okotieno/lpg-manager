import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { NotificationUserModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class NotificationUserBackendService extends CrudAbstractService<NotificationUserModel> {
  constructor(
    @InjectModel(NotificationUserModel)
    private notificationUserModel: typeof NotificationUserModel,
  ) {
    super(notificationUserModel);
  }
}
