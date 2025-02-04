import { signalStore, withMethods, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateOrderGQL,
  ICreateOrderMutation,
  ICreateOrderMutationVariables,
  IDeleteOrderByIdGQL,
  IGetOrdersGQL,
  IGetOrdersQuery,
  IGetOrdersQueryVariables,
  IUpdateOrderStatusGQL,
  IGetOrderStatsGQL,
} from './order.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';
import { lastValueFrom } from 'rxjs';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';
import { IOrderStatus } from '@lpg-manager/types';

export const OrderStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateOrderGQL),
    _getItemKey: 'order',
    _getItemsGQL: inject(IGetOrdersGQL),
    _deleteItemWithIdGQL: inject(IDeleteOrderByIdGQL),
    _updateOrderStatusGQL: inject(IUpdateOrderStatusGQL),
    _getOrderStatsGQL: inject(IGetOrderStatsGQL),
  })),
  withPaginatedItemsStore<
    ICreateOrderMutation,
    ICreateOrderMutationVariables,
    ICreateOrderGQL,
    NonNullable<NonNullable<IGetOrdersQuery['orders']['items']>[number]>,
    IGetOrdersQueryVariables,
    'orders',
    'deleteOrder'
  >(),
  withMethods((store) => ({
    async updateOrderStatus(orderId: string, status: IOrderStatus) {
      try {
        const result = await lastValueFrom(
          store._updateOrderStatusGQL.mutate(
            {
              id: orderId,
              params: { status },
            },
            {
              context: {
                [SHOW_SUCCESS_MESSAGE]: true,
                [SHOW_ERROR_MESSAGE]: true,
              },
            }
          )
        );

        if (result.data?.updateOrderStatus.data) {
          // Update the order in the store
          // store.updateItem(orderId, result.data.updateOrderStatus.data);
        }

        return result.data?.updateOrderStatus.data;
      } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    },
    async getOrderStats() {
      try {
        const result = await lastValueFrom(
          store._getOrderStatsGQL.fetch()
        );
        return result.data?.orderStats;
      } catch (error) {
        console.error('Error fetching order stats:', error);
        throw error;
      }
    }
  }))
);
