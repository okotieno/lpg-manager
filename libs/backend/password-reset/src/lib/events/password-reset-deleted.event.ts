import { PasswordResetModel } from '@lpg-manager/db';

export class PasswordResetDeletedEvent {
  constructor(public passwordReset: PasswordResetModel) {}
}
