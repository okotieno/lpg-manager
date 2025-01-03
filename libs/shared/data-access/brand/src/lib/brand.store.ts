import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateBrandGQL,
  ICreateBrandMutation,
  ICreateBrandMutationVariables,
  IDeleteBrandByIdGQL,
  IGetBrandsGQL,
  IGetBrandsQuery,
  IGetBrandsQueryVariables,
} from './brand.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const BrandStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateBrandGQL),
    _getItemKey: 'brand',
    _getItemsGQL: inject(IGetBrandsGQL),
    _deleteItemWithIdGQL: inject(IDeleteBrandByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateBrandMutation,
    ICreateBrandMutationVariables,
    ICreateBrandGQL,
    NonNullable<NonNullable<IGetBrandsQuery['brands']['items']>[number]>,
    IGetBrandsQueryVariables,
    'brands',
    'deleteBrand'
  >()
);
