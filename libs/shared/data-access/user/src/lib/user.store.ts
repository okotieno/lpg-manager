import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateUserGQL,
  ICreateUserMutation,
  ICreateUserMutationVariables,
  IDeleteUserByIdGQL,
  IGetUsersGQL,
  IGetUsersQuery,
  IGetUsersQueryVariables,
} from './schemas/user.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const UserStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateUserGQL),
    _getItemKey: 'user',
    _getItemsGQL: inject(IGetUsersGQL),
    _deleteItemWithIdGQL: inject(IDeleteUserByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateUserMutation,
    ICreateUserMutationVariables,
    ICreateUserGQL,
    NonNullable<NonNullable<IGetUsersQuery['users']['items']>[number]>,
    IGetUsersQueryVariables,
    'users',
    'deleteUser'
  >()
);
