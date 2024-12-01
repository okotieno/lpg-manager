import { PasswordResetModel } from '@lpg-manager/db';

export class PasswordResetUpdatedEvent {
  constructor(public passwordReset: PasswordResetModel) {}
}
