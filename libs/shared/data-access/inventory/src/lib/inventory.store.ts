import {
  signalStore,
  withProps
} from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteInventoryByIdGQL,
  IGetInventoriesGQL, IGetInventoriesQuery,
  IGetInventoriesQueryVariables
} from './inventory.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const InventoryStore = signalStore(
  withProps(() => ({
    _getItemKey: 'inventory',
    _getItemsGQL: inject(IGetInventoriesGQL),
    _deleteItemWithIdGQL: inject(IDeleteInventoryByIdGQL),
  })),
  withPaginatedItemsStore<
    NonNullable<
      NonNullable<IGetInventoriesQuery['inventories']['items']>[number]
    >,
    IGetInventoriesQueryVariables, 'inventories', 'deleteInventory'>(),
);
