import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteUserByIdGQL,
  IGetUsersGQL,
  IGetUsersQueryVariables,
} from './schemas/user.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';
import { IUserModel } from '@lpg-manager/types';

export const UserStore = signalStore(
  withProps(() => ({
    _getItemKey: 'station',
    _getItemsGQL: inject(IGetUsersGQL),
    _deleteItemWithIdGQL: inject(IDeleteUserByIdGQL),
  })),
  withPaginatedItemsStore<
    IUserModel,
    IGetUsersQueryVariables,
    'users',
    'deleteUser'
  >()
);
