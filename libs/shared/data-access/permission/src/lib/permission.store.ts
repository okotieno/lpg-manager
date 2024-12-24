import {
  signalStore,
  withProps,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  IDeletePermissionByIdGQL,
  IGetPermissionsGQL,
} from './schemas/permission.generated';
import { IRoleModel } from '@lpg-manager/types';
import { IGetRolesQueryVariables } from '@lpg-manager/role-store';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export const PermissionsStore = signalStore(
  withProps(() => ({
    _getItemKey: 'permission',
    _getItemsGQL: inject(IGetPermissionsGQL),
    _deleteItemWithIdGQL: inject(IDeletePermissionByIdGQL),
  })),
  withPaginatedItemsStore<IRoleModel, IGetRolesQueryVariables, 'permissions', 'deletePermission'>(),
)
