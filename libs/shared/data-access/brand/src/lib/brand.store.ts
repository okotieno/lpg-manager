import { patchState, signalStore, withComputed, withHooks, withState } from '@ngrx/signals';
import { computed, inject, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApolloQueryResult } from '@apollo/client';
import { IGetBrandsGQL, IGetBrandsQuery } from './brand.generated';
import { IRoleModel } from '@lpg-manager/types';

interface RoleStoreState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  rolesResource?: ResourceRef<ApolloQueryResult<IGetBrandsQuery>>
}
const initialState:RoleStoreState = {
  currentPage: 1,
  pageSize: 20,
  totalItems: 0,
  rolesResource: undefined
}

export const BrandsStore = signalStore(
  withState(initialState),
  withComputed((store) => {
    const items = computed(() =>
       store.rolesResource?.()?.value()?.data.brands.items ?? [] as IGetBrandsQuery['brands']['items'] as IRoleModel[]
    )
    return { items }
  }),
  withHooks((store, getUsersGQL = inject(IGetBrandsGQL)) => {
    const rolesResource = rxResource({
      loader: () => {
        return getUsersGQL.fetch({})
      }
    })
    patchState(store, { rolesResource })
    return {}
  })
)
