import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
  withProps,
  type,
} from '@ngrx/signals';
import { computed, inject, InjectionToken, resource } from '@angular/core';
import { Mutation, MutationResult, Query } from 'apollo-angular';
import {
  Exact,
  InputMaybe,
  IQueryParams,
  IQueryParamsFilter,
  ISortByEnum,
} from '@lpg-manager/types';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { defaultQueryParams } from './default-variables';

export const GET_ITEMS_INCLUDE_FIELDS = new InjectionToken<
  Record<string, boolean>
>('get-items-include-fields');

type Meta = {
  totalItems: number;
};

export type IGetItemsQuery<RootField extends string, TItem> = {
  [key in RootField]: {
    items?: Array<TItem | null> | null;
    meta?: Meta | null;
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
  IGetItemsQueryItem,
  IGetItemsQueryVariables extends Exact<{
    query?: InputMaybe<IQueryParams>;
  }>,
  RootField extends string,
  D extends string
>() =>
  signalStoreFeature(
    {
      props: type<{
        _getItemsGQL: Query<
          IGetItemsQuery<RootField, IGetItemsQueryItem>,
          IGetItemsQueryVariables
        >;
        _deleteItemWithIdGQL: Mutation<IDeleteItemMutation<D>, { id: string }>;
        _getItemKey: string;
      }>(),
    },
    withState({
      ...defaultQueryParams.query,
      sortBy: defaultQueryParams.query.sortBy as keyof IGetItemsQueryItem,
      totalItems: 0,
      items: [],
      deleteItemId: undefined,
    } as StoreState<IGetItemsQueryItem>),
    withComputed((store) => ({
      _getItemsKey: computed(() => (store._getItemKey + 's') as RootField),
      _deleteItemWithIdKey: computed(() => `delete${store._getItemKey}`),
    })),
    withProps(() => ({
      _getItemsIncludeFields: inject(GET_ITEMS_INCLUDE_FIELDS),
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
                  ...store._getItemsIncludeFields,
                } as IGetItemsQueryVariables,

                { fetchPolicy: 'cache-first' }
              )
              .pipe(
                tap((result) => {
                  if (result) {
                    const getItemsKey = store._getItemsKey();
                    console.log(result.data, getItemsKey);

                    const newItems = result.data[getItemsKey].items ?? [];

                    patchState(store, {
                      items: [...newItems.filter((x) => x !== null)],
                    });

                    if (result.data[getItemsKey].meta?.totalItems) {
                      patchState(store, {
                        totalItems: result.data[getItemsKey]?.meta?.totalItems,
                      });
                    }
                  }
                })
              )
          );
        },
      }),
      _deleteItemWithIdResource: resource({
        request: () => ({ id: store.deleteItemId?.() }),
        loader: ({ request }) => {
          const id = request.id;
          if (!id) {
            return Promise.resolve(undefined);
          }
          return lastValueFrom(
            store._deleteItemWithIdGQL?.mutate({ id }) as Observable<
              MutationResult<IDeleteItemMutation<RootField>>
            >
          );
        },
      }),
    })),
    withComputed((store) => ({
      isLoading: computed(
        () =>
          store._itemResource.isLoading() ||
          store._deleteItemWithIdResource.isLoading()
      ),
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
      setSortBy(key: keyof IGetItemsQueryItem) {
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
