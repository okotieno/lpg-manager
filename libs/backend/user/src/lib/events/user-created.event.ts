import { UserModel } from '@lpg-manager/db';

export class UserCreatedEvent {
  constructor(public user: UserModel, public plainPassword?: string) {}
}
