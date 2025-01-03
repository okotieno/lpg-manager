import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateDriverGQL,
  ICreateDriverMutation,
  ICreateDriverMutationVariables,
  IDeleteDriverByIdGQL,
  IGetDriversGQL,
  IGetDriversQuery,
  IGetDriversQueryVariables,
} from './driver.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const DriverStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateDriverGQL),
    _getItemKey: 'driver',
    _getItemsGQL: inject(IGetDriversGQL),
    _deleteItemWithIdGQL: inject(IDeleteDriverByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateDriverMutation,
    ICreateDriverMutationVariables,
    ICreateDriverGQL,
    NonNullable<NonNullable<IGetDriversQuery['drivers']['items']>[number]>,
    IGetDriversQueryVariables,
    'drivers',
    'deleteDriver'
  >()
);
