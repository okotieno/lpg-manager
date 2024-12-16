import {
  signalStore,
  withHooks,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IGetBrandsGQL,
  IGetBrandsQueryVariables,
} from './brand.generated';
import { IBrandModel } from '@lpg-manager/types';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const BrandsStore = signalStore(
  withPaginatedItemsStore<IBrandModel, 'brands', IGetBrandsQueryVariables>(),
  withHooks((store, getBrandsGQL = inject(IGetBrandsGQL)) => ({
    onInit: () => {
      store._createResource(getBrandsGQL, 'brands');
    },
  }))
);
