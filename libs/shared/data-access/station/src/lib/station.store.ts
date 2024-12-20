import { signalStore, withHooks } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IGetStationsGQL,
  IGetStationsQueryVariables,
} from './station.generated';
import { IStationModel } from '@lpg-manager/types';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const StationsStore = signalStore(
  withPaginatedItemsStore<
    IStationModel,
    'stations',
    IGetStationsQueryVariables
  >(),
  withHooks((store, getStationsGQL = inject(IGetStationsGQL)) => ({
    onInit: () => {
      store._createResource(getStationsGQL, 'stations');
    },
  }))
);
