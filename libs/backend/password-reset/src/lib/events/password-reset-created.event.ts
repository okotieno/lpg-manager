import { PasswordResetModel } from '@lpg-manager/db';

export class PasswordResetCreatedEvent {
  constructor(public passwordReset: PasswordResetModel) {}
}
