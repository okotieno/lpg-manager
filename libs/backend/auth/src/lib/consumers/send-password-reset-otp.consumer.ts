import { Process, Processor } from '@nestjs/bull';
import { SEND_PASSWORD_RESET_OTP_QUEUE } from '../constants/queue.constants';
import { EmailService } from '@lpg-manager/email-service';
import { Job } from 'bull';

@Processor(SEND_PASSWORD_RESET_OTP_QUEUE)
export class SendPasswordResetOtpConsumer {
  constructor(
    private emailService: EmailService
  ) {
  }


  @Process()
  async sendPasswordResetOtpEmail(job: Job<{email: string, otp: string, firstName: string}>): Promise<void> {

    await this.emailService.send({
      from: process.env['LPG_MAIL_FROM'],
      to: job.data.email,
      subject: 'Your Password Reset Link',
      template: 'reset-password-otp.template',
      context: {
        otp: job.data.otp,
        firstName: job.data.firstName,
      }
    });
  }


}
