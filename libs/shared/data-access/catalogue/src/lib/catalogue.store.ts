import {
  signalStore,
  withProps
} from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeleteCatalogueByIdGQL,
  IGetCataloguesGQL,
  IGetCataloguesQueryVariables
} from './catalogue.generated';

import { withPaginatedItemsStore } from '@lpg-manager/data-table';
import { ICatalogueModel } from '@lpg-manager/types';

export const CataloguesStore = signalStore(
  withProps(() => ({
    _getItemKey: 'catalogue',
    _getItemsGQL: inject(IGetCataloguesGQL),
    _deleteItemWithIdGQL: inject(IDeleteCatalogueByIdGQL),
  })),
  // withPaginatedItemsStore<ICatalogueModel , IGetCataloguesQueryVariables, 'catalogues', 'deleteCatalogue'>(),
  withPaginatedItemsStore<any , IGetCataloguesQueryVariables, 'catalogues', 'deleteCatalogue'>(),
);
