import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteVehicleByIdGQL,
  IGetVehiclesGQL,
  IGetVehiclesQuery,
  IGetVehiclesQueryVariables,
} from './vehicle.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const VehicleStore = signalStore(
  withProps(() => ({
    _getItemKey: 'vehicle',
    _getItemsGQL: inject(IGetVehiclesGQL),
    _deleteItemWithIdGQL: inject(IDeleteVehicleByIdGQL),
  })),
  withPaginatedItemsStore<
    NonNullable<NonNullable<IGetVehiclesQuery['vehicles']['items']>[number]>,
    IGetVehiclesQueryVariables,
    'vehicles',
    'deleteVehicle'
  >()
);
