import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateCatalogueGQL,
  ICreateCatalogueMutation,
  ICreateCatalogueMutationVariables,
  IDeleteCatalogueByIdGQL,
  IGetCataloguesGQL,
  IGetCataloguesQuery,
  IGetCataloguesQueryVariables,
} from './catalogue.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const CatalogueStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateCatalogueGQL),
    _getItemKey: 'catalogue',
    _getItemsGQL: inject(IGetCataloguesGQL),
    _deleteItemWithIdGQL: inject(IDeleteCatalogueByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateCatalogueMutation,
    ICreateCatalogueMutationVariables,
    ICreateCatalogueGQL,
    NonNullable<
      NonNullable<IGetCataloguesQuery['catalogues']['items']>[number]
    >,
    IGetCataloguesQueryVariables,
    'catalogues',
    'deleteCatalogue'
  >()
);
