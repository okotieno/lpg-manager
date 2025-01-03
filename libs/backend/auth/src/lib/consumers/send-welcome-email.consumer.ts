import { Process, Processor } from '@nestjs/bull';
import { EmailService } from '@lpg-manager/email-service';
import { Job } from 'bull';
import { SEND_WELCOME_EMAIL_QUEUE } from '../constants/queue.constants';

@Processor(SEND_WELCOME_EMAIL_QUEUE)
export class SendWelcomeEmailConsumer {
  constructor(private emailService: EmailService) {}

  @Process()
  async sendWelcomeEmail(
    job: Job<{ email: string; firstName: string }>
  ): Promise<void> {
    await this.emailService.send({
      to: job.data.email,
      subject: 'Welcome to Tahiniwa!',
      template: 'welcome-template',
      context: {
        firstName: job.data.firstName,
      },
    });
  }
}
