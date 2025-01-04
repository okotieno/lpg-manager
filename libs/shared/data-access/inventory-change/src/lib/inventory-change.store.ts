import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateInventoryChangeGQL,
  ICreateInventoryChangeMutation,
  ICreateInventoryChangeMutationVariables,
  IDeleteInventoryChangeByIdGQL,
  IGetInventoryChangesGQL,
  IGetInventoryChangesQuery,
  IGetInventoryChangesQueryVariables,
} from './inventory-change.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const InventoryChangeStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateInventoryChangeGQL),
    _getItemKey: 'inventoryChanges',
    _getItemsGQL: inject(IGetInventoryChangesGQL),
    _deleteItemWithIdGQL: inject(IDeleteInventoryChangeByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateInventoryChangeMutation,
    ICreateInventoryChangeMutationVariables,
    ICreateInventoryChangeGQL,
    NonNullable<
      NonNullable<IGetInventoryChangesQuery['inventoryChanges']['items']>[number]
    >,
    IGetInventoryChangesQueryVariables,
    'inventoryChanges',
    'deleteInventoryChange'
  >()
);
