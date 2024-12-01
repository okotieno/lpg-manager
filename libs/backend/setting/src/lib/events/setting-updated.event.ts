import { SettingModel } from '@lpg-manager/db';

export class SettingUpdatedEvent {
  constructor(public setting: SettingModel) {}
}
