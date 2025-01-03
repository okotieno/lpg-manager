import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateStationGQL,
  ICreateStationMutation,
  ICreateStationMutationVariables,
  IDeleteStationByIdGQL,
  IGetStationsGQL,
  IGetStationsQuery,
  IGetStationsQueryVariables,
} from './station.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const StationStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateStationGQL),
    _getItemKey: 'station',
    _getItemsGQL: inject(IGetStationsGQL),
    _deleteItemWithIdGQL: inject(IDeleteStationByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateStationMutation,
    ICreateStationMutationVariables,
    ICreateStationGQL,
    NonNullable<NonNullable<IGetStationsQuery['stations']['items']>[number]>,
    IGetStationsQueryVariables,
    'stations',
    'deleteStation'
  >()
);
