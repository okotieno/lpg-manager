import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created.event';
import { EmailService } from '@lpg-manager/email-service';

@Injectable()
export class UserModelEventsListener {
  constructor(private welcomeEmailService: EmailService) {

  }

  @OnEvent('user.created')
  async sendWelcomeEmail($event: UserCreatedEvent) {
    if($event.user.email) {
      // await this.welcomeEmailService.send($event.user.email)
    }
  }
}
