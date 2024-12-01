import { SettingModel } from '@lpg-manager/db';

export class SettingDeletedEvent {
  constructor(public setting: SettingModel) {}
}
