import {
  signalStore,
  withHooks,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IGetUsersGQL,
  IGetUsersQueryVariables,
} from './schemas/user.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';
import { IUserModel } from '@lpg-manager/types';

export const UserStore = signalStore(
  withPaginatedItemsStore<IUserModel, 'users', IGetUsersQueryVariables>(),
  withHooks((store, getUsersGQL = inject(IGetUsersGQL)) => ({
    onInit: () => {
      store._createResource(getUsersGQL, 'users');
    },
  }))
);
