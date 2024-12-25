import {
  signalStore,
  withProps,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeletePermissionByIdGQL,
  IGetPermissionsGQL, IGetPermissionsQuery
} from './schemas/permission.generated';
import { IGetRolesQueryVariables } from '@lpg-manager/role-store';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const PermissionsStore = signalStore(
  withProps(() => ({
    _getItemKey: 'permission',
    _getItemsGQL: inject(IGetPermissionsGQL),
    _deleteItemWithIdGQL: inject(IDeletePermissionByIdGQL),
  })),
  withPaginatedItemsStore<
    NonNullable<NonNullable<IGetPermissionsQuery['permissions']['items']>[number]>
    , IGetRolesQueryVariables, 'permissions', 'deletePermission'>(),
)
