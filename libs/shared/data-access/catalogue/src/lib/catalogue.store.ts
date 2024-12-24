import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteCatalogueByIdGQL,
  IGetCataloguesGQL,
  IGetCataloguesQuery,
  IGetCataloguesQueryVariables,
} from './catalogue.generated';

import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const CataloguesStore = signalStore(
  withProps(() => ({
    _getItemKey: 'catalogue',
    _getItemsGQL: inject(IGetCataloguesGQL),
    _deleteItemWithIdGQL: inject(IDeleteCatalogueByIdGQL),
  })),
  withPaginatedItemsStore<
    NonNullable<
      NonNullable<IGetCataloguesQuery['catalogues']['items']>[number]
    >,
    IGetCataloguesQueryVariables,
    'catalogues',
    'deleteCatalogue'
  >()
);
