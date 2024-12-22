import {
  signalStore,
  withProps
} from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteBrandByIdGQL,
  IGetBrandsGQL,
  IGetBrandsQueryVariables
} from './brand.generated';
import { IBrandModel } from '@lpg-manager/types';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const BrandsStore = signalStore(
  withProps(() => ({
    _getItemKey: 'brand',
    _getItemsGQL: inject(IGetBrandsGQL),
    _deleteItemWithIdGQL: inject(IDeleteBrandByIdGQL),
  })),
  withPaginatedItemsStore<IBrandModel, IGetBrandsQueryVariables, 'brands', 'deleteBrand'>(),
);
