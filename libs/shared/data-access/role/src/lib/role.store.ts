import { signalStore, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  ICreateRoleGQL,
  ICreateRoleMutation,
  ICreateRoleMutationVariables,
  IDeleteRoleByIdGQL,
  IGetRolesGQL,
  IGetRolesQuery,
  IGetRolesQueryVariables,
} from './role.generated';
import { withPaginatedItemsStore } from '@lpg-manager/data-table';

export type IRoleItem =
  NonNullable<NonNullable<IGetRolesQuery['roles']['items']>[number]>

export const RoleStore = signalStore(
  withProps(() => ({
    _createItemGQL: inject(ICreateRoleGQL),
    _getItemKey: 'role',
    _getItemsGQL: inject(IGetRolesGQL),
    _deleteItemWithIdGQL: inject(IDeleteRoleByIdGQL),
  })),
  withPaginatedItemsStore<
    ICreateRoleMutation,
    ICreateRoleMutationVariables,
    ICreateRoleGQL,
    IRoleItem,
    IGetRolesQueryVariables,
    'roles',
    'deleteRole'
  >()
);
