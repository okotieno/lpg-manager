import { UserModel } from '@lpg-manager/db';

export class UserUpdatedEvent {
  constructor(public user: UserModel) {}
}
