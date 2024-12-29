import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteOrderByIdGQL,
  IGetOrdersGQL, IGetOrdersQuery,
  IGetOrdersQueryVariables
} from './order.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const OrderStore = signalStore(
  withProps(() => ({
    _getItemKey: 'order',
    _getItemsGQL: inject(IGetOrdersGQL),
    _deleteItemWithIdGQL: inject(IDeleteOrderByIdGQL),
  })),
  withPaginatedItemsStore<
    NonNullable<
      NonNullable<IGetOrdersQuery['orders']['items']>[number]
    >,
    IGetOrdersQueryVariables,
    'orders',
    'deleteOrder'
  >()
);
