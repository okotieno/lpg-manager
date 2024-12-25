import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import { IDeleteRoleByIdGQL, IGetRolesGQL, IGetRolesQuery, IGetRolesQueryVariables } from './role.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const RoleStore = signalStore(
  withProps(() => ({
    _getItemKey: 'role',
    _getItemsGQL: inject(IGetRolesGQL),
    _deleteItemWithIdGQL: inject(IDeleteRoleByIdGQL),
  })),
  withPaginatedItemsStore<
    NonNullable<NonNullable<IGetRolesQuery['roles']['items']>[number]>
    , IGetRolesQueryVariables, 'roles', 'deleteRole'>(),
)
