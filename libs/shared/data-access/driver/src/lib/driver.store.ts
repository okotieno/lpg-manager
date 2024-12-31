import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteDriverByIdGQL,
  IGetDriversGQL,
  IGetDriversQuery,
  IGetDriversQueryVariables,
} from './driver.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const DriverStore = signalStore(
  withProps(() => ({
    _getItemKey: 'driver',
    _getItemsGQL: inject(IGetDriversGQL),
    _deleteItemWithIdGQL: inject(IDeleteDriverByIdGQL),
  })),
  withPaginatedItemsStore<
    NonNullable<NonNullable<IGetDriversQuery['drivers']['items']>[number]>,
    IGetDriversQueryVariables,
    'drivers',
    'deleteDriver'
  >()
); 