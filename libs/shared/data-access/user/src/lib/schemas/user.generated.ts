import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateUserMutationVariables = Types.Exact<{
  params: Types.ICreateUserInput;
}>;


export type ICreateUserMutation = { createUser?: { message: string, data: { id: string } } | null };

export type IUpdateUserMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateUserInput;
}>;


export type IUpdateUserMutation = { updateUser?: { message: string, data: { id: string } } | null };

export type IGetUserByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetUserByIdQuery = { user?: { phone?: string | null, id: string, email: string, firstName: string, lastName: string, profilePhotoLink?: string | null, createdAt?: string | null, roles?: Array<{ id: string, role?: { id: string, name: string } | null, station?: { id: string, name: string, type: Types.IStationType } | null } | null> | null } | null };

export type IGetUsersQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetUsersQuery = { users: { items?: Array<{ id: string, firstName: string, lastName: string, email: string, phone?: string | null } | null> | null, meta?: { totalItems: number } | null } };

export type IAssignRolesToUserMutationVariables = Types.Exact<{
  roles: Array<Types.InputMaybe<Types.IUserRoleInput>> | Types.InputMaybe<Types.IUserRoleInput>;
  userId: Types.Scalars['String']['input'];
}>;


export type IAssignRolesToUserMutation = { assignRoleToUser?: { message: string } | null };

export type IDeleteUserByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteUserByIdMutation = { deleteUser?: { message: string } | null };

export type IUserWithRolesQueryVariables = Types.Exact<{
  userId: Types.Scalars['UUID']['input'];
}>;


export type IUserWithRolesQuery = { user?: { phone?: string | null, id: string, email: string, firstName: string, lastName: string, profilePhotoLink?: string | null, createdAt?: string | null } | null, userRoles?: { items?: Array<{ id: string, name: string, permissions?: Array<{ id: string, name: string } | null> | null } | null> | null, meta?: { totalItems: number } | null } | null };

export type IGetUserCountQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type IGetUserCountQuery = { userCount: { count: number } };

export const CreateUserDocument = gql`
    mutation CreateUser($params: CreateUserInput!) {
  createUser(params: $params) {
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
  export class ICreateUserGQL extends Apollo.Mutation<ICreateUserMutation, ICreateUserMutationVariables> {
    override document = CreateUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: UUID!, $params: UpdateUserInput!) {
  updateUser(id: $id, params: $params) {
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
  export class IUpdateUserGQL extends Apollo.Mutation<IUpdateUserMutation, IUpdateUserMutationVariables> {
    override document = UpdateUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUserByIdDocument = gql`
    query GetUserById($id: UUID!) {
  user(id: $id) {
    phone
    id
    email
    firstName
    lastName
    profilePhotoLink
    createdAt
    roles {
      id
      role {
        id
        name
      }
      station {
        id
        name
        type
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetUserByIdGQL extends Apollo.Query<IGetUserByIdQuery, IGetUserByIdQueryVariables> {
    override document = GetUserByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUsersDocument = gql`
    query GetUsers($query: QueryParams) {
  users(query: $query) {
    items {
      id
      firstName
      lastName
      email
      phone
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
  export class IGetUsersGQL extends Apollo.Query<IGetUsersQuery, IGetUsersQueryVariables> {
    override document = GetUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AssignRolesToUserDocument = gql`
    mutation AssignRolesToUser($roles: [UserRoleInput]!, $userId: String!) {
  assignRoleToUser(roles: $roles, userId: $userId) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAssignRolesToUserGQL extends Apollo.Mutation<IAssignRolesToUserMutation, IAssignRolesToUserMutationVariables> {
    override document = AssignRolesToUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteUserByIdDocument = gql`
    mutation DeleteUserById($id: UUID!) {
  deleteUser(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteUserByIdGQL extends Apollo.Mutation<IDeleteUserByIdMutation, IDeleteUserByIdMutationVariables> {
    override document = DeleteUserByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserWithRolesDocument = gql`
    query UserWithRoles($userId: UUID!) {
  user(id: $userId) {
    phone
    id
    email
    firstName
    lastName
    profilePhotoLink
    createdAt
  }
  userRoles(userId: $userId) {
    items {
      id
      name
      permissions {
        id
        name
      }
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
  export class IUserWithRolesGQL extends Apollo.Query<IUserWithRolesQuery, IUserWithRolesQueryVariables> {
    override document = UserWithRolesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUserCountDocument = gql`
    query GetUserCount {
  userCount {
    count
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetUserCountGQL extends Apollo.Query<IGetUserCountQuery, IGetUserCountQueryVariables> {
    override document = GetUserCountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }