import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteTransporterByIdGQL,
  IGetTransportersGQL,
  IGetTransportersQuery,
  IGetTransportersQueryVariables,
} from './transporter.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const TransporterStore = signalStore(
  withProps(() => ({
    _getItemKey: 'transporter',
    _getItemsGQL: inject(IGetTransportersGQL),
    _deleteItemWithIdGQL: inject(IDeleteTransporterByIdGQL),
  })),
  withPaginatedItemsStore<
    NonNullable<NonNullable<IGetTransportersQuery['transporters']['items']>[number]>,
    IGetTransportersQueryVariables,
    'transporters',
    'deleteTransporter'
  >()
); 