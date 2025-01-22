import { DispatchModel } from '@lpg-manager/db';

export class DispatchEvent {
  constructor(public dispatch: DispatchModel, public userId: string) {}
}
