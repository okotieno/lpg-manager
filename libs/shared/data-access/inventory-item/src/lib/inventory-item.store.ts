import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateInventoryItemGQL,
  ICreateInventoryItemMutation,
  ICreateInventoryItemMutationVariables,
  IDeleteInventoryItemByIdGQL,
  IGetInventoryItemsGQL,
  IGetInventoryItemsQuery,
  IGetInventoryItemsQueryVariables,
} from './inventory-item.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const InventoryItemStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateInventoryItemGQL),
    _getItemKey: 'inventoryItem',
    _getItemsGQL: inject(IGetInventoryItemsGQL),
    _deleteItemWithIdGQL: inject(IDeleteInventoryItemByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateInventoryItemMutation,
    ICreateInventoryItemMutationVariables,
    ICreateInventoryItemGQL,
    NonNullable<
      NonNullable<IGetInventoryItemsQuery['inventoryItems']['items']>[number]
    >,
    IGetInventoryItemsQueryVariables,
    'inventoryItems',
    'deleteInventoryItem'
  >()
);
