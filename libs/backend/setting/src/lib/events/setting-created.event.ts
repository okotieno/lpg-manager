import { SettingModel } from '@lpg-manager/db';

export class SettingCreatedEvent {
  constructor(public setting: SettingModel) {}
}
