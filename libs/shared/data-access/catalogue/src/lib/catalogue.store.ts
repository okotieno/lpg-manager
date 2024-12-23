import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteCatalogueByIdGQL,
  IGetCataloguesGQL,
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
    {
      id: string;
      name: string;
    },
    IGetCataloguesQueryVariables,
    'catalogues',
    'deleteCatalogue'
  >()
);
