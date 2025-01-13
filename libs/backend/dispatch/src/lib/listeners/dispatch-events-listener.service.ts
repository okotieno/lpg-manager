import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DispatchEvent } from '../events/dispatch.event';

@Injectable()
export class DispatchEventsListenerService {

  @OnEvent('dispatch.depotToDriverConfirmed')
  async informDriverOfDepotConfirmation($event: DispatchEvent) {

  }
}
