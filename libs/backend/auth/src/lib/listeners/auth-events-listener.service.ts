import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthEvent } from '../events/auth.event';
import { RoleService } from '@lpg-manager/role-service';
import { InjectQueue } from '@nestjs/bull';
import {
  SEND_VERIFICATION_LINK_QUEUE,
  SEND_WELCOME_EMAIL_QUEUE,
} from '../constants/queue.constants';
import { Queue } from 'bull';
import { ActivityLogBackendService } from '@lpg-manager/activity-log-service';

@Injectable()
export class AuthEventsListenerService {
  constructor(
    private roleService: RoleService,
    private activityLogService: ActivityLogBackendService,
    @InjectQueue(SEND_VERIFICATION_LINK_QUEUE)
    private readonly sendVerificationLinkQueue: Queue,
    @InjectQueue(SEND_WELCOME_EMAIL_QUEUE)
    private readonly sendWelcomeEmailQueue: Queue<{
      email: string;
      firstName: string;
    }>
  ) {}

  @OnEvent('auth.registered')
  async assignRoleExaminerToUser($event: AuthEvent) {
    try {
      await this.roleService.assignRoleToUser($event.user.id, 'Examiner');
    } catch (e) {
      Logger.log(e);
    }
  }

  @OnEvent('auth.registered')
  async sendVerificationEmail($event: AuthEvent) {
    if (!$event.user.emailVerifiedAt) {
      await this.sendVerificationLinkQueue.add({ email: $event.user.email });
    }
  }

  @OnEvent('auth.registered')
  async addAuthRegisteredActivity($event: AuthEvent) {
    const activity = await this.activityLogService.create({
      userId: $event.user.id,
      action: 'auth.registered',
      description: 'User registered',
    });
    await activity.$set('users', [$event.user.id]);
  }

  @OnEvent('auth.verified')
  async sendWelcomeEmail($event: AuthEvent) {
    await this.sendWelcomeEmailQueue.add(
      {
        email: $event.user.email as string,
        firstName: $event.user.firstName as string,
      },
      {
        delay: 60000,
      }
    );
  }

  @OnEvent('auth.verified')
  async addAuthVerifiedActivity($event: AuthEvent) {
    const activity = await this.activityLogService.create({
      userId: $event.user.id,
      action: 'auth.verified',
      description: 'User verified',
      type: 'INFO',
    });
    await activity.$set('users', [$event.user.id]);
  }

  @OnEvent('auth.continue-with-google')
  async addAuthContinueWithGoogleActivity($event: AuthEvent) {
    const activity = await this.activityLogService.create({
      userId: $event.user.id,
      action: 'auth.continue-with-google',
      description: 'Login with Google',
      type: 'INFO',
    });
    await activity.$set('users', [$event.user.id]);
  }
  @OnEvent('auth.continue-with-google')
  async addAuthLoginActivity($event: AuthEvent) {
    const activity = await this.activityLogService.create({
      userId: $event.user.id,
      action: 'auth.login',
      description: 'Logged in',
      type: 'INFO',
    });
    await activity.$set('users', [$event.user.id]);
  }
}
