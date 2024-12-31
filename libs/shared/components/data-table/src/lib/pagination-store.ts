import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, inject, InjectionToken, resource } from '@angular/core';
import { Mutation, MutationResult, Query } from 'apollo-angular';
import {
  Exact,
  InputMaybe,
  IQueryOperatorEnum,
  IQueryParams,
  IQueryParamsFilter,
  ISortByEnum,
} from '@lpg-manager/types';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { defaultQueryParams } from './default-variables';
import {
  setAllEntities,
  setEntities,
  withEntities,
} from '@ngrx/signals/entities';

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
  [K in D]: {
    message: string;
  };
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
  _selectedItems: { id: string }[];
}

export const withPaginatedItemsStore = <
  IGetItemsQueryItem extends { id: string },
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
    withEntities({
      entity: type<IGetItemsQueryItem>(),
      collection: 'searchedItems',
    }),
    withEntities({
      entity: type<IGetItemsQueryItem>(),
      collection: 'selectedItems',
    }),
    withState({
      ...defaultQueryParams.query,
      sortBy: defaultQueryParams.query.sortBy as keyof IGetItemsQueryItem,
      totalItems: 0,
      items: [],
      deleteItemId: undefined,
      _selectedItems: [],
    } as StoreState<IGetItemsQueryItem>),
    withComputed((store) => ({
      _getItemsKey: computed(() => {
        const key = store._getItemKey;
        return (key.endsWith('y') ? key.slice(0, -1) + 'ies' : key + 's') as RootField;
      }),
      _deleteItemWithIdKey: computed(() => `delete${store._getItemKey}`),
    })),
    withProps(() => ({
      _getItemsIncludeFields: inject(GET_ITEMS_INCLUDE_FIELDS),
    })),
    withProps((store) => ({
      _selectedItemResource: resource({
        request: () => ({ selectedItemIds: store._selectedItems() }),
        loader: ({ request }) => {
          if (store._selectedItems().length < 1) {
            setAllEntities([], {
              collection: 'selectedItems',
            });
            return Promise.resolve(undefined);
          }
          return lastValueFrom(
            store._getItemsGQL
              ?.fetch(
                {
                  query: {
                    sortBy: store.sortBy(),
                    sortByDirection: store.sortByDirection(),
                    searchTerm: '',
                    currentPage: 1,
                    pageSize: request.selectedItemIds.length,
                    filters: [
                      {
                        field: 'id',
                        operator: IQueryOperatorEnum.In,
                        values: request.selectedItemIds.map((x) => x.id),
                      },
                    ],
                  },
                } as IGetItemsQueryVariables,

                { fetchPolicy: 'cache-first' }
              )
              .pipe(
                tap((result) => {
                  if (result) {
                    const newItems = (
                      result.data[store._getItemsKey()].items ?? []
                    ).filter((x) => x !== null);
                    patchState(
                      store,
                      setAllEntities(newItems, {
                        collection: 'selectedItems',
                      })
                    );
                  }
                })
              )
          );
        },
      }),
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

                    const newItems = (
                      result.data[getItemsKey].items ?? []
                    ).filter((x) => x !== null);

                    if (store.currentPage() < 2) {
                      patchState(
                        store,
                        setAllEntities(newItems, {
                          collection: 'searchedItems',
                        })
                      );
                    } else {
                      patchState(
                        store,
                        setEntities(newItems, { collection: 'searchedItems' })
                      );
                    }

                    patchState(store, {
                      items: [...newItems],
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
      setSelectedItemIds(_selectedItems: { id: string }[]) {
        patchState(store, { _selectedItems });
      },
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
      createNewItem(params: any) {
        console.log('Function not implemented!!!');
      }
    }))
  );
