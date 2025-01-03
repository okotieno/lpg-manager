import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateTransporterGQL,
  ICreateTransporterMutation,
  ICreateTransporterMutationVariables,
  IDeleteTransporterByIdGQL,
  IGetTransportersGQL,
  IGetTransportersQuery,
  IGetTransportersQueryVariables,
} from './transporter.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const TransporterStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateTransporterGQL),
    _getItemKey: 'transporter',
    _getItemsGQL: inject(IGetTransportersGQL),
    _deleteItemWithIdGQL: inject(IDeleteTransporterByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateTransporterMutation,
    ICreateTransporterMutationVariables,
    ICreateTransporterGQL,
    NonNullable<
      NonNullable<IGetTransportersQuery['transporters']['items']>[number]
    >,
    IGetTransportersQueryVariables,
    'transporters',
    'deleteTransporter'
  >()
);
