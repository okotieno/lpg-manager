import { patchState, signalStore, withComputed, withHooks, withState } from '@ngrx/signals';
import { computed, inject, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApolloQueryResult } from '@apollo/client';
import { IGetRolesGQL, IGetRolesQuery } from './role.generated';
import { IRoleModel } from '@lpg-manager/types';

interface RoleStoreState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  rolesResource?: ResourceRef<ApolloQueryResult<IGetRolesQuery>>
}
const initialState:RoleStoreState = {
  currentPage: 1,
  pageSize: 20,
  totalItems: 0,
  rolesResource: undefined
}

export const RolesStore = signalStore(
  withState(initialState),
  withComputed((store) => {
    const items = computed(() =>
       store.rolesResource?.()?.value()?.data.roles.items ?? [] as IGetRolesQuery['roles']['items'] as IRoleModel[]
    )
    return { items }
  }),
  withHooks((store, getUsersGQL = inject(IGetRolesGQL)) => {
    const rolesResource = rxResource({
      loader: () => {
        return getUsersGQL.fetch({})
      }
    })
    patchState(store, { rolesResource })
    return {}
  })
)
