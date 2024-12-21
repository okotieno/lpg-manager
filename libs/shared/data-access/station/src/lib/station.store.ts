import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IGetStationsGQL,
  IGetStationsQueryVariables,
} from './station.generated';
import { IStationModel } from '@lpg-manager/types';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const StationsStore = signalStore(
  withProps(() => ({
    _getItemsGQL: inject(IGetStationsGQL),
    _getItemsKey: 'stations',
  })),
  withPaginatedItemsStore<
    IStationModel,
    'stations',
    IGetStationsQueryVariables
  >(),
);
