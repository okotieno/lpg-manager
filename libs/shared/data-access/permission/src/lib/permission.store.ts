import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject, ResourceRef } from '@angular/core';
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
}

const initialState: PermissionStoreState = {
  searchTerm: '',
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  itemsResource: undefined,
};

export const PermissionsStore = signalStore(
  withState(initialState),
  withComputed((store) => {
    const items = computed(
      () =>
        store.itemsResource?.()?.value()?.data.permissions.items ??
        ([] as IGetPermissionsQuery['permissions']['items'] as IPermissionModel[])
    );
    return { items };
  }),
  withMethods((store) => ({
    searchItemsByTerm(searchTerm: string) {
      patchState(store, { currentPage: 1, searchTerm });
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

    patchState(store, { itemsResource });
    return {};
  })
);
