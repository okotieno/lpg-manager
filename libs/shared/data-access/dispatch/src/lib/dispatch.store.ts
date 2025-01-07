import { signalStore, withProps, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDealerToDriverConfirmGQL,
  ICreateDispatchGQL,
  ICreateDispatchMutation,
  ICreateDispatchMutationVariables,
  IDeleteDispatchByIdGQL,
  IGetDispatchesGQL,
  IGetDispatchesQuery,
  IGetDispatchesQueryVariables
} from './dispatch.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';
import { lastValueFrom, tap } from 'rxjs';
import { SHOW_SUCCESS_MESSAGE, SHOW_ERROR_MESSAGE } from '@lpg-manager/injection-token';
import { patchState } from '@ngrx/signals';

export const DispatchStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateDispatchGQL),
    _getItemKey: 'dispatch',
    _getItemsGQL: inject(IGetDispatchesGQL),
    _deleteItemWithIdGQL: inject(IDeleteDispatchByIdGQL),
    _dealerToDriverConfirmGQL: inject(IDealerToDriverConfirmGQL),
  })),
  withPaginatedItemsStore<
    ICreateDispatchMutation,
    ICreateDispatchMutationVariables,
    ICreateDispatchGQL,
    NonNullable<
      NonNullable<IGetDispatchesQuery['dispatches']['items']>[number]
    >,
    IGetDispatchesQueryVariables,
    'dispatches',
    'deleteDispatch'
  >(),
  withMethods((store) => ({
    dealerToDriverConfirm(params: { dispatchId: string; scannedCanisters: string[] }) {
      return lastValueFrom(
        store._dealerToDriverConfirmGQL
          .mutate(
            { params },
            {
              context: {
                [SHOW_SUCCESS_MESSAGE]: true,
                [SHOW_ERROR_MESSAGE]: true,
              },
            }
          )
          .pipe(
            tap((res) => {
              if (res.data?.dealerToDriverConfirm.data) {
                console.log('res.data.dealerToDriverConfirm.data', res.data?.dealerToDriverConfirm.data);
                // patchState(store, {
                //   items: store.items().map((item) =>
                //     item.id === params.dispatchId
                //       ? res.data!.dealerToDriverConfirm.data
                //       : item
                //   ),
                // });
              }
            })
          )
      );
    },
  }))
);
