import { patchState, signalStore, withComputed, withHooks, withState } from '@ngrx/signals';
import { computed, inject, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApolloQueryResult } from '@apollo/client';
import { IGetPermissionsGQL, IGetPermissionsQuery } from './schemas/permission.generated';
import { IPermissionModel } from '@lpg-manager/types';

interface PermissionStoreState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  permissionsResource?: ResourceRef<ApolloQueryResult<IGetPermissionsQuery>>
}
const initialState:PermissionStoreState = {
  currentPage: 1,
  pageSize: 20,
  totalItems: 0,
  permissionsResource: undefined
}

export const PermissionsStore = signalStore(
  withState(initialState),
  withComputed((store) => {
    const items = computed(() =>
       store.permissionsResource?.()?.value()?.data.permissions.items ?? [] as IGetPermissionsQuery['permissions']['items'] as IPermissionModel[]
    )
    return { items }
  }),
  withHooks((store, getUsersGQL = inject(IGetPermissionsGQL)) => {
    const permissionsResource = rxResource({
      loader: () => {
        return getUsersGQL.fetch({})
      }
    })
    patchState(store, { permissionsResource })
    return {}
  })
)
