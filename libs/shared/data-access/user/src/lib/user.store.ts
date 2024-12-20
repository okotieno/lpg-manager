import {
  signalStore,
  withProps
} from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IGetUsersGQL,
  IGetUsersQueryVariables,
} from './schemas/user.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';
import { IUserModel } from '@lpg-manager/types';

export const UserStore = signalStore(
  withProps(() => ({
    _getItemsGQL: inject(IGetUsersGQL),
    _getItemsKey: 'users',
  })),
  withPaginatedItemsStore<IUserModel, 'users', IGetUsersQueryVariables>(),
);
