import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { SettingModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { SettingEnum } from './setting.enum';

@Injectable()
export class SettingBackendService extends CrudAbstractService<SettingModel> {
  constructor(@InjectModel(SettingModel) settingModel: typeof SettingModel) {
    super(settingModel);
  }

  getByName(name: SettingEnum) {
    return this.repository.findOne({
      where: { name },
    }) as Promise<SettingModel>;
  }
}
