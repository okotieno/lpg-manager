import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import { IDeleteRoleByIdGQL, IGetRolesGQL, IGetRolesQueryVariables } from './role.generated';
import { IRoleModel } from '@lpg-manager/types';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const RoleStore = signalStore(
  withProps(() => ({
    _getItemKey: 'role',
    _getItemsGQL: inject(IGetRolesGQL),
    _deleteItemWithIdGQL: inject(IDeleteRoleByIdGQL),
  })),
  withPaginatedItemsStore<IRoleModel, IGetRolesQueryVariables, 'roles', 'deleteRole'>(),
)
