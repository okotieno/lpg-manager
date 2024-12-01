import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PasswordResetCreatedEvent } from '../events/password-reset-created.event';

@Injectable()
export class PasswordResetModelEventsListener {
  @OnEvent('password-reset.created')
  async handlePasswordResetCreated($event: PasswordResetCreatedEvent) {
    Logger.log(
      'Password reset created event event => id',
      $event.passwordReset.id,
    );
  }
}
