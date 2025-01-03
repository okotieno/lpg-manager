import { Process, Processor } from '@nestjs/bull';
import { SEND_PASSWORD_RESET_LINK_QUEUE } from '../constants/queue.constants';
import { EmailService } from '@lpg-manager/email-service';
import { Job } from 'bull';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '@lpg-manager/user-service';
import { PasswordResetBackendService } from '@lpg-manager/password-reset-service';
import { TranslationService } from '@lpg-manager/translation';
import { ActivityLogBackendService } from '@lpg-manager/activity-log-service';

@Processor(SEND_PASSWORD_RESET_LINK_QUEUE)
export class SendPasswordResetLinkConsumer {
  constructor(
    private emailService: EmailService,
    private userService: UserService,
    private passwordResetService: PasswordResetBackendService,
    private translationService: TranslationService,
    private activityLogService: ActivityLogBackendService
  ) {}

  @Process()
  async sendPasswordResetLinkEmail(job: Job<{ email: string }>): Promise<void> {
    const user = await this.userService.findByEmail(job.data.email);
    if (user) {
      const token = await this.passwordResetService.generatePasswordResetToken(
        job.data.email
      );
      const resetLink = `${process.env['LPG_APP_URL']}/auth/reset-password/${token}`;
      await this.emailService.send({
        from: process.env['LPG_MAIL_FROM'],
        to: job.data.email,
        subject: 'Your Password Reset Link',
        template: 'reset-password-link-template',
        context: {
          firstName: user.firstName,
          resetLink: resetLink,
        },
      });

      const activity = await this.activityLogService.create({
        userId: user.id,
        action: 'auth.password-reset-link-request',
        description: 'User requested for password reset link',
        type: 'INFO',
      });
      await activity.$set('users', [user.id]);
    } else {
      throw new NotFoundException(
        this.translationService.getTranslation('alert.emailNotFound')
      );
    }
  }
}
