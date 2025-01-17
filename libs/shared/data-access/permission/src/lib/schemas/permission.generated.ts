import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreatePermissionMutationVariables = Types.Exact<{
  params: Types.ICreatePermissionInput;
}>;


export type ICreatePermissionMutation = { createPermission?: { message: string, data: { id: string } } | null };

export type IGetPermissionByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetPermissionByIdQuery = { permission?: { id: string, name: Types.IPermissionEnum } | null };

export type IGetPermissionsQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetPermissionsQuery = { permissions: { items?: Array<{ id: string, name: Types.IPermissionEnum } | null> | null, meta?: { totalItems: number } | null } };

export type IDeletePermissionByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeletePermissionByIdMutation = { deletePermission: { message: string } };

export const CreatePermissionDocument = gql`
    mutation CreatePermission($params: CreatePermissionInput!) {
  createPermission(params: $params) {
    message
    data {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ICreatePermissionGQL extends Apollo.Mutation<ICreatePermissionMutation, ICreatePermissionMutationVariables> {
    override document = CreatePermissionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPermissionByIdDocument = gql`
    query GetPermissionById($id: UUID!) {
  permission(id: $id) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetPermissionByIdGQL extends Apollo.Query<IGetPermissionByIdQuery, IGetPermissionByIdQueryVariables> {
    override document = GetPermissionByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPermissionsDocument = gql`
    query GetPermissions($query: QueryParams) {
  permissions(query: $query) {
    items {
      id
      name
    }
    meta {
      totalItems
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetPermissionsGQL extends Apollo.Query<IGetPermissionsQuery, IGetPermissionsQueryVariables> {
    override document = GetPermissionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeletePermissionByIdDocument = gql`
    mutation DeletePermissionById($id: UUID!) {
  deletePermission(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeletePermissionByIdGQL extends Apollo.Mutation<IDeletePermissionByIdMutation, IDeletePermissionByIdMutationVariables> {
    override document = DeletePermissionByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }