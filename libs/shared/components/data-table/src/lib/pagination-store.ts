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
import { computed, resource } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client';
import { Mutation, MutationResult, Query } from 'apollo-angular';
import {
  IQueryParams,
  IQueryParamsFilter,
  ISortByEnum,
} from '@lpg-manager/types';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { defaultQueryParams } from './default-variables';

export type IGetItemsQuery<T, P extends string> = {
  [K in P]: {
    items?: Array<T | null> | null;
    meta?: { totalItems: number } | null;
  };
};

export type IDeleteItemMutation<D extends string> = {
  [K in D]?: {
    message: string;
  } | null;
};

interface StoreState<T> {
  deleteItemId?: string;
  sortBy: keyof T;
  sortByDirection: ISortByEnum;
  filters: IQueryParamsFilter[];
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}

export const withPaginatedItemsStore = <
  T,
  V extends {
    query?: IQueryParams | null;
  },
  C extends string,
  D extends string,
>() =>
  signalStoreFeature(
    {
      props: type<{
        _getItemsGQL: Query<IGetItemsQuery<T, C>, V>;
        _deleteItemWithIdGQL: Mutation<IDeleteItemMutation<D>, { id: string }>;
        _getItemKey: string;
      }>(),
    },
    withEntities<T>(),
    withState({
      ...defaultQueryParams.query,
      sortBy: defaultQueryParams.query.sortBy as keyof T,
      totalItems: 0,
      items: [],
      deleteItemId: undefined,
    } as StoreState<T>),
    withComputed((store) => ({
      _getItemsKey: computed(() => store._getItemKey + 's'),
      _deleteItemWithIdKey: computed(() => `delete${store._getItemKey}`),
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
                  console.log(result);
                  if (result) {
                    const getItemsKey =
                      store._getItemsKey() as keyof IGetItemsQuery<T, C>;
                    const newItems = result.data[getItemsKey].items ?? [];

                    patchState(store, { items: [...newItems] as T[] });

                    if (result.data[getItemsKey].meta?.totalItems) {
                      patchState(store, {
                        totalItems: result.data[getItemsKey]?.meta?.totalItems,
                      });
                    }
                  }
                })
              ) as Observable<ApolloQueryResult<IGetItemsQuery<T, C>>>
          );
        },
      }),
      _deleteItemWithIdResource: resource({
        request: () => ({ id: store.deleteItemId?.() }),
        loader: ({ request }) => {
          console.log('reached 6', request);
          const id = request.id;
          if (!id) {
            return Promise.resolve(undefined);
          }
          return lastValueFrom(
            store._deleteItemWithIdGQL?.mutate({ id }).pipe(
              tap((result) => {
                console.log(result);
              })
            ) as Observable<MutationResult<IDeleteItemMutation<C>>>
          );
        },
      }),
    })),
    withComputed((store)=> ({
      isLoading: computed(() => store._itemResource.isLoading() || store._deleteItemWithIdResource.isLoading()),
    })),
    withMethods((store) => ({
      searchItemsByTerm(searchTerm: string) {
        patchState(store, { currentPage: 1, searchTerm, items: [] });
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
      },
      deleteItemWithId(id: string) {
        patchState(store, { deleteItemId: id });
      },
    }))
  );
