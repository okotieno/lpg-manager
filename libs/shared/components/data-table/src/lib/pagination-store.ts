import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import { computed, effect, inject, ResourceRef, untracked } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApolloQueryResult } from '@apollo/client';
import { IGetPermissionsGQL } from '@lpg-manager/permission-store';
import { Query } from 'apollo-angular';
import { IQueryParams } from '@lpg-manager/types';

export type IGetItemsQuery<T, P extends string> = {
  [K in P]: {
    items?: Array<T | null> | null;
    meta?: { totalItems: number } | null;
  };
};

interface StoreState<T, P extends string> {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemsResource?: ResourceRef<ApolloQueryResult<IGetItemsQuery<T, P>>>;
  allItems: T[];
}

export const withPaginatedItemsStore = < T, P extends string, V extends { query?: IQueryParams | null }>() => signalStoreFeature(
  withState({
    searchTerm: '',
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    itemsResource: undefined,
    allItems: [],
  } as StoreState<T, P> ),
  withComputed((store) => {
    const items = computed(() => store.allItems());
    return { items };
  }),
  withMethods((store) => ({
    _createResource(
      getItemsGQL: Query<IGetItemsQuery<T, P>, V>,
      getItemsKey: keyof IGetItemsQuery<T, P>
    ) {
      const itemsResource = rxResource({
        request: () => ({
          searchTerm: store.searchTerm(),
          currentPage: store.currentPage(),
          pageSize: store.pageSize(),
        } as IQueryParams ),
        loader: ({ request }) => {
          return getItemsGQL.fetch({
            query: {
              ...request,
            },
          } as V);
        },
      });
      effect(() => {
        const result = itemsResource?.value();
        untracked(() => {
          if (result) {
            const newItems = (result.data[getItemsKey].items ??
              []);
            const currentItems = store.allItems();

            if (store.currentPage() === 1) {
              // Reset items if it's the first page
              patchState(store, { allItems: [...newItems] as T[] });
            } else {
              // Append items for subsequent pages
              patchState(store, { allItems: [...currentItems, ...newItems] as T[] });
            }

            // Update total items count
            if (result.data[getItemsKey].meta?.totalItems) {
              patchState(store, {
                totalItems: result.data[getItemsKey].meta.totalItems,
              });
            }
          }
        });
      });
      patchState(store, { itemsResource });
    },
    searchItemsByTerm(searchTerm: string) {
      patchState(store, { currentPage: 1, searchTerm, allItems: [] });
      store.itemsResource?.()?.reload();
    },
    setCurrentPage(page: number) {
      patchState(store, { currentPage: page });
    },
    setPageSize(size: number) {
      patchState(store, { pageSize: size });
    },
    fetchNextPage() {
      patchState(store, { currentPage: store.currentPage() + 1 });
      store.itemsResource?.()?.reload();
    },
  })),
);
