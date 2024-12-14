import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject, ResourceRef, untracked } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApolloQueryResult } from '@apollo/client';
import {
  IGetPermissionsGQL,
  IGetPermissionsQuery,
} from './schemas/permission.generated';
import { IPermissionModel } from '@lpg-manager/types';

interface PermissionStoreState {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemsResource?: ResourceRef<ApolloQueryResult<IGetPermissionsQuery>>;
  allItems: IPermissionModel[];
}

const initialState: PermissionStoreState = {
  searchTerm: '',
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  itemsResource: undefined,
  allItems: [],
};

export const PermissionsStore = signalStore(
  withState(initialState),
  withComputed((store) => {
    const items = computed(() => store.allItems());
    return { items };
  }),
  withMethods((store) => ({
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
  withHooks((store, getPermissionsGQL = inject(IGetPermissionsGQL)) => {
    const itemsResource = rxResource({
      request: () => ({
        searchTerm: store.searchTerm(),
        currentPage: store.currentPage(),
        pageSize: store.pageSize(),
      }),
      loader: ({ request }) => {
        return getPermissionsGQL.fetch({
          query: {
            ...request,
          },
        });
      },
    });

    // Handle resource updates
    effect(() => {
      const result = itemsResource?.value();
      untracked(() => {
        if (result) {
          const newItems = (result.data.permissions.items ?? []) as IPermissionModel[];
          const currentItems = store.allItems();

          if (store.currentPage() === 1) {
            // Reset items if it's the first page
            patchState(store, { allItems: [...newItems] });
          } else {
            // Append items for subsequent pages
            patchState(store, { allItems: [...currentItems, ...newItems] });
          }

          // Update total items count
          if (result.data.permissions.meta?.totalItems) {
            patchState(store, { totalItems: result.data.permissions.meta.totalItems });
          }
        }
      })
    });

    patchState(store, { itemsResource });
    return {};
  })
);
