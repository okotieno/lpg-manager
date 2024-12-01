import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SettingCreatedEvent } from '../events/setting-created.event';

@Injectable()
export class SettingModelEventsListener {
  @OnEvent('setting.created')
  async handleSettingCreated($event: SettingCreatedEvent) {
    Logger.log('Examinee created event event => id', $event.setting.id);
  }
}
