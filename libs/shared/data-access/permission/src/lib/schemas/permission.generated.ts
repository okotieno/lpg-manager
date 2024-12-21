import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreatePermissionMutationVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
}>;


export type ICreatePermissionMutation = { createPermission?: { message: string, data: { id: any } } | null };

export type IGetPermissionByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetPermissionByIdQuery = { permission?: { id: any, name: string } | null };

export type IGetPermissionsQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetPermissionsQuery = { permissions: { items?: Array<{ id: any, name: string } | null> | null, meta?: { totalItems: number } | null } };

export const CreatePermissionDocument = gql`
    mutation CreatePermission($name: String!) {
  createPermission(name: $name) {
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