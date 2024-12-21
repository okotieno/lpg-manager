import {
  signalStore,
  withProps
} from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IGetBrandsGQL,
  IGetBrandsQueryVariables,
} from './brand.generated';
import { IBrandModel } from '@lpg-manager/types';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const BrandsStore = signalStore(
  withProps(() => ({
    _getItemsGQL: inject(IGetBrandsGQL),
    _getItemsKey: 'brands',
  })),
  withPaginatedItemsStore<IBrandModel, 'brands', IGetBrandsQueryVariables>(),
);
