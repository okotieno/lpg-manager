import { signalStore, withHooks } from '@ngrx/signals';
import { inject } from '@angular/core';
import { IGetRolesGQL } from './role.generated';
import { IRoleModel } from '@lpg-manager/types';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';
import { IGetBrandsQueryVariables } from '@lpg-manager/brand-store';

export const RoleStore = signalStore(
  withPaginatedItemsStore<IRoleModel, 'roles', IGetBrandsQueryVariables>(),
  withHooks((store, getRolesGQL = inject(IGetRolesGQL)) => ({
    onInit: () => {
      store._createResource(getRolesGQL, 'roles');
    },
  }))
)
