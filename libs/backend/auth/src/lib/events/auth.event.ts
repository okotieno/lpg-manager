import { UserModel } from '@lpg-manager/db';

export class AuthEvent {
  constructor(
    public user: UserModel,
  ) {}
}
