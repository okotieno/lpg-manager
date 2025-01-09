import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateDriverInventoryGQL,
  ICreateDriverInventoryMutation,
  ICreateDriverInventoryMutationVariables,
  IDeleteDriverInventoryByIdGQL,
  IGetDriverInventoriesGQL,
  IGetDriverInventoriesQuery,
  IGetDriverInventoriesQueryVariables,
} from './driver-inventory.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const DriverInventoryStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateDriverInventoryGQL),
    _getItemKey: 'driverInventory',
    _getItemsGQL: inject(IGetDriverInventoriesGQL),
    _deleteItemWithIdGQL: inject(IDeleteDriverInventoryByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateDriverInventoryMutation,
    ICreateDriverInventoryMutationVariables,
    ICreateDriverInventoryGQL,
    NonNullable<
      NonNullable<IGetDriverInventoriesQuery['driverInventories']['items']>[number]
    >,
    IGetDriverInventoriesQueryVariables,
    'driverInventories',
    'deleteDriverInventory'
  >()
);
