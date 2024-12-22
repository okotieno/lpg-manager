import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteStationByIdGQL,
  IGetStationsGQL,
  IGetStationsQueryVariables
} from './station.generated';
import { IStationModel } from '@lpg-manager/types';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const StationsStore = signalStore(
  withProps(() => ({
    _getItemKey: 'station',
    _getItemsGQL: inject(IGetStationsGQL),
    _deleteItemWithIdGQL: inject(IDeleteStationByIdGQL),
  })),
  withPaginatedItemsStore<
    IStationModel,
    IGetStationsQueryVariables,
    'stations',
    'deleteStation'
  >()
);
