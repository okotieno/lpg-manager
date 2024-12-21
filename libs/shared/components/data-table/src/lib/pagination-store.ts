import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
  withProps,
  type,
} from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { computed, resource, ResourceRef } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client';
import { Query } from 'apollo-angular';
import {
  IQueryParams,
  IQueryParamsFilter,
  ISortByEnum,
} from '@lpg-manager/types';
import { lastValueFrom, Observable, tap } from 'rxjs';

export type IGetItemsQuery<T, P extends string> = {
  [K in P]: {
    items?: Array<T | null> | null;
    meta?: { totalItems: number } | null;
  };
};

interface StoreState<T, P extends string> {
  sortBy: keyof T;
  sortByDirection: ISortByEnum;
  filters: IQueryParamsFilter[];
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
    {
      props: type<{
        _getItemsGQL: Query<IGetItemsQuery<T, P>, V>;
        _getItemsKey: string;
      }>(),
    },
    withEntities<T>(),
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
    withProps((store) => ({
      _itemResource: resource({
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
          return lastValueFrom(
            store._getItemsGQL
              ?.fetch(
                {
                  query: {
                    ...request,
                  },
                } as V,
                { fetchPolicy: 'cache-first' }
              )
              .pipe(
                tap((result) => {
                  if (result) {
                    const getItemsKey =
                      store._getItemsKey as keyof IGetItemsQuery<T, P>;
                    const newItems = result.data[getItemsKey].items ?? [];

                    patchState(store, { items: [...newItems] as T[] });

                    if (result.data[getItemsKey].meta?.totalItems) {
                      patchState(store, {
                        totalItems: result.data[getItemsKey]?.meta?.totalItems,
                      });
                    }
                  }
                })
              ) as Observable<ApolloQueryResult<IGetItemsQuery<T, P>>>
          );
        },
      }),
    })),
    withMethods((store) => ({
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
