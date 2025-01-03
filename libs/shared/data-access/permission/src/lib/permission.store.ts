import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreatePermissionGQL,
  ICreatePermissionMutation,
  ICreatePermissionMutationVariables,
  IDeletePermissionByIdGQL,
  IGetPermissionsGQL,
  IGetPermissionsQuery,
  IGetPermissionsQueryVariables,
} from './schemas/permission.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const PermissionStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreatePermissionGQL),
    _getItemKey: 'permission',
    _getItemsGQL: inject(IGetPermissionsGQL),
    _deleteItemWithIdGQL: inject(IDeletePermissionByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreatePermissionMutation,
    ICreatePermissionMutationVariables,
    ICreatePermissionGQL,
    NonNullable<
      NonNullable<IGetPermissionsQuery['permissions']['items']>[number]
    >,
    IGetPermissionsQueryVariables,
    'permissions',
    'deletePermission'
  >()
);
