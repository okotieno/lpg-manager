import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateRoleMutationVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
}>;


export type ICreateRoleMutation = { createRole?: { message: string, data: { id: string } } | null };

export type IGetRoleByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type IGetRoleByIdQuery = { role?: { id: string, name: string, permissions?: Array<{ id: string, name: string } | null> | null } | null };

export type IGetRoleByIdWithPermissionQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type IGetRoleByIdWithPermissionQuery = { role?: { id: string, name: string, permissions?: Array<{ id: string, name: string } | null> | null } | null };

export type IGetRolesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetRolesQuery = { roles: { items?: Array<{ id: string, name: string } | null> | null, meta?: { totalItems: number } | null } };

export type IGivePermissionsToRoleMutationVariables = Types.Exact<{
  permissions?: Types.InputMaybe<Array<Types.InputMaybe<Types.ISelectCategory>> | Types.InputMaybe<Types.ISelectCategory>>;
  roleId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type IGivePermissionsToRoleMutation = { givePermissionsToRole?: { message: string } | null };

export type IDeleteRoleByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type IDeleteRoleByIdMutation = { deleteRole?: { message: string } | null };

export type IUpdateRoleMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  name: Types.Scalars['String']['input'];
}>;


export type IUpdateRoleMutation = { updateRole?: { message: string, data: { id: string } } | null };

export const CreateRoleDocument = gql`
    mutation CreateRole($name: String!) {
  createRole(name: $name) {
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
  export class ICreateRoleGQL extends Apollo.Mutation<ICreateRoleMutation, ICreateRoleMutationVariables> {
    override document = CreateRoleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetRoleByIdDocument = gql`
    query GetRoleById($id: String!) {
  role(id: $id) {
    id
    name
    permissions {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetRoleByIdGQL extends Apollo.Query<IGetRoleByIdQuery, IGetRoleByIdQueryVariables> {
    override document = GetRoleByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetRoleByIdWithPermissionDocument = gql`
    query GetRoleByIdWithPermission($id: String!) {
  role(id: $id) {
    id
    name
    permissions {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetRoleByIdWithPermissionGQL extends Apollo.Query<IGetRoleByIdWithPermissionQuery, IGetRoleByIdWithPermissionQueryVariables> {
    override document = GetRoleByIdWithPermissionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetRolesDocument = gql`
    query GetRoles($query: QueryParams) {
  roles(query: $query) {
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
  export class IGetRolesGQL extends Apollo.Query<IGetRolesQuery, IGetRolesQueryVariables> {
    override document = GetRolesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GivePermissionsToRoleDocument = gql`
    mutation GivePermissionsToRole($permissions: [SelectCategory], $roleId: String) {
  givePermissionsToRole(permissions: $permissions, roleId: $roleId) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGivePermissionsToRoleGQL extends Apollo.Mutation<IGivePermissionsToRoleMutation, IGivePermissionsToRoleMutationVariables> {
    override document = GivePermissionsToRoleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteRoleByIdDocument = gql`
    mutation DeleteRoleById($id: String!) {
  deleteRole(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteRoleByIdGQL extends Apollo.Mutation<IDeleteRoleByIdMutation, IDeleteRoleByIdMutationVariables> {
    override document = DeleteRoleByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateRoleDocument = gql`
    mutation UpdateRole($id: String!, $name: String!) {
  updateRole(id: $id, params: {name: $name}) {
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
  export class IUpdateRoleGQL extends Apollo.Mutation<IUpdateRoleMutation, IUpdateRoleMutationVariables> {
    override document = UpdateRoleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }