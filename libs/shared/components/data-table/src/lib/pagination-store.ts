import {
  patchState,
  signalStoreFeature, withComputed,
  withMethods,
  withState
} from '@ngrx/signals';
import { computed, effect, ResourceRef, untracked } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApolloQueryResult } from '@apollo/client';
import { Query } from 'apollo-angular';
import { IQueryParams, IQueryParamsFilter, ISortByEnum } from '@lpg-manager/types';
import { tap } from 'rxjs';

export type IGetItemsQuery<T, P extends string> = {
  [K in P]: {
    items?: Array<T | null> | null;
    meta?: { totalItems: number } | null;
  };
};

interface StoreState<T, P extends string> {
  sortBy: keyof T;
  sortByDirection: ISortByEnum;
  filters: IQueryParamsFilter[],
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemsResource?: ResourceRef<ApolloQueryResult<IGetItemsQuery<T, P>>>;
  items: T[];
}

export const withPaginatedItemsStore = <
  T,
  P extends string,
  V extends {
    query?: IQueryParams | null;
  }
>() =>
  signalStoreFeature(
    withState({
      filters: [],
      sortBy: 'id' as keyof T,
      sortByDirection: ISortByEnum.Asc,
      searchTerm: '',
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      itemsResource: undefined,
      items: [],
    } as StoreState<T, P>),
    withComputed((store) => ({
      isLoading: computed(() => !!store.itemsResource?.()?.isLoading()),
    })),
    withMethods((store) => ({
      _createResource(
        getItemsGQL: Query<IGetItemsQuery<T, P>, V>,
        getItemsKey: keyof IGetItemsQuery<T, P>
      ) {
        const itemsResource = rxResource({
          request: () =>
            ({
              sortBy: store.sortBy(),
              sortByDirection: store.sortByDirection(),
              searchTerm: store.searchTerm(),
              currentPage: store.currentPage(),
              pageSize: store.pageSize(),
              filters: store.filters(),
            } as IQueryParams),
          loader: ({ request }) => {
            return getItemsGQL.fetch({
              query: {
                ...request,
              },
            } as V).pipe(tap((res) => {
              console.log('fetched', res.data[getItemsKey]?.meta?.totalItems)
            }));
          },
        });
        effect(() => {
          console.log('changePicked', itemsResource?.value()?.data[getItemsKey]?.meta?.totalItems );
          const result = itemsResource?.value();
          untracked(() => {
            if (result) {
              const newItems = result.data[getItemsKey].items ?? [];

              patchState(store, { items: [...newItems] as T[] });

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
        patchState(store, { currentPage: 1, searchTerm, items: [] });
        store.itemsResource?.()?.reload();
      },
      setCurrentPage(page: number) {
        patchState(store, { currentPage: page });
      },
      setPageSize(size: number) {
        patchState(store, { pageSize: size });
      },
      setSortBy(key: keyof T) {
        patchState(store, { sortBy: key });
      },
      setSortByDirection(direction: ISortByEnum) {
        patchState(store, { sortByDirection: direction });
      },
      setFilters(queryParamsFilters: IQueryParamsFilter[]) {
        patchState(store, { filters: queryParamsFilters });
      },
      setSearchTerm(searchTerm: string) {
        patchState(store, { searchTerm });
      },
      fetchNextPage() {
        patchState(store, { currentPage: store.currentPage() + 1 });
        store.itemsResource?.()?.reload();
      },
    }))
  );
