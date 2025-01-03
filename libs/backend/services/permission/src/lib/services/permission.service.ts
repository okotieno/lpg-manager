import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { PermissionModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PermissionService extends CrudAbstractService<PermissionModel> {
  constructor(
    @InjectModel(PermissionModel) repository: typeof PermissionModel
  ) {
    super(repository);
  }
}
