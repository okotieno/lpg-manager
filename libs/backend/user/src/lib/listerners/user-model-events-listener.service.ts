import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created.event';
import { EmailService } from '@lpg-manager/email-service';

@Injectable()
export class UserModelEventsListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('user.created')
  async sendWelcomeEmail(event: UserCreatedEvent) {
    if (event.user.email && event.plainPassword) {
      await this.emailService.send({
        to: event.user.email,
        template: 'welcome-template',
        context: {
          firstName: event.user.firstName,
          email: event.user.email,
          password: event.plainPassword, // Include temporary password in email
        },
      });
    }
  }
}
