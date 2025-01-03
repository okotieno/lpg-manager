import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateDispatchGQL,
  ICreateDispatchMutation,
  ICreateDispatchMutationVariables,
  IDeleteDispatchByIdGQL,
  IGetDispatchesGQL,
  IGetDispatchesQuery,
  IGetDispatchesQueryVariables,
} from './dispatch.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const DispatchStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateDispatchGQL),
    _getItemKey: 'dispatch',
    _getItemsGQL: inject(IGetDispatchesGQL),
    _deleteItemWithIdGQL: inject(IDeleteDispatchByIdGQL),
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
  >()
);
