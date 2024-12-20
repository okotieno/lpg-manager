import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import { IGetRolesGQL } from './role.generated';
import { IRoleModel } from '@lpg-manager/types';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';
import { IGetBrandsQueryVariables } from '@lpg-manager/brand-store';

export const RoleStore = signalStore(
  withProps(() => ({
    _getItemsGQL: inject(IGetRolesGQL),
    _getItemsKey: 'roles',
  })),
  withPaginatedItemsStore<IRoleModel, 'roles', IGetBrandsQueryVariables>(),
)
