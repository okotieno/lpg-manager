import * as Types from '@lpg-manager/types';

import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

export type ICreateUserMutationVariables = Types.Exact<{
  phone: Types.Scalars['String']['input'];
  email: Types.Scalars['String']['input'];
  firstName: Types.Scalars['String']['input'];
  lastName: Types.Scalars['String']['input'];
  middleName?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ICreateUserMutation = { createUser?: { message: string, data: { id?: number | null } } | null };

export type IUpdateUserMutationVariables = Types.Exact<{
  userId: Types.Scalars['Int']['input'];
  phone: Types.Scalars['String']['input'];
  email: Types.Scalars['String']['input'];
  firstName: Types.Scalars['String']['input'];
  lastName: Types.Scalars['String']['input'];
  middleName?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type IUpdateUserMutation = { updateUser?: { message: string, data: { id?: number | null } } | null };

export type IGetUserByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type IGetUserByIdQuery = { user?: { phone?: string | null, id?: number | null, email?: string | null, firstName?: string | null, lastName?: string | null, profilePhotoLink?: string | null, createdAt?: string | null } | null };

export type IGetUsersQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetUsersQuery = { users: { items?: Array<{ id?: number | null, firstName?: string | null, lastName?: string | null, email?: string | null, phone?: string | null } | null> | null, meta?: { totalItems: number } | null } };

export type IAssignRolesToUserMutationVariables = Types.Exact<{
  roles?: Types.InputMaybe<Array<Types.InputMaybe<Types.ISelectCategory>> | Types.InputMaybe<Types.ISelectCategory>>;
  userId?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type IAssignRolesToUserMutation = { assignRoleToUser?: { message: string } | null };

export type IDeleteUserByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type IDeleteUserByIdMutation = { deleteUser?: { message: string } | null };

export type IUserWithRolesQueryVariables = Types.Exact<{
  userId: Types.Scalars['Int']['input'];
}>;


export type IUserWithRolesQuery = { user?: { phone?: string | null, id?: number | null, email?: string | null, firstName?: string | null, lastName?: string | null, profilePhotoLink?: string | null, createdAt?: string | null } | null, userRoles?: { items?: Array<{ id: number, name: string, permissions?: Array<{ id: number, name: string } | null> | null } | null> | null, meta?: { totalItems: number } | null } | null };

export type IAssignCountriesLanguagesToUserMutationVariables = Types.Exact<{
  userId: Types.Scalars['Int']['input'];
  countriesLanguages: Array<Types.ICountriesLanguagesInput> | Types.ICountriesLanguagesInput;
}>;


export type IAssignCountriesLanguagesToUserMutation = { assignCountriesLanguagesToUser?: { message: string } | null };

export type IAllocateWarehouseMutationVariables = Types.Exact<{
  userId: Types.Scalars['Int']['input'];
  warehouses: Array<Types.ISelectCategory> | Types.ISelectCategory;
}>;


export type IAllocateWarehouseMutation = { allocateWarehouseToUser?: { message: string } | null };

export const CreateUserDocument = gql`
    mutation CreateUser($phone: String!, $email: String!, $firstName: String!, $lastName: String!, $middleName: String) {
  createUser(
    phone: $phone
    lastName: $lastName
    middleName: $middleName
    firstName: $firstName
    email: $email
  ) {
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
    mutation UpdateUser($userId: Int!, $phone: String!, $email: String!, $firstName: String!, $lastName: String!, $middleName: String) {
  updateUser(
    id: $userId
    params: {phone: $phone, lastName: $lastName, middleName: $middleName, firstName: $firstName, email: $email}
  ) {
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
    query GetUserById($id: Int!) {
  user(id: $id) {
    phone
    id
    email
    firstName
    lastName
    profilePhotoLink
    createdAt
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
    mutation AssignRolesToUser($roles: [SelectCategory], $userId: Int) {
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
    mutation DeleteUserById($id: Int!) {
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
    query UserWithRoles($userId: Int!) {
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
export const AssignCountriesLanguagesToUserDocument = gql`
    mutation AssignCountriesLanguagesToUser($userId: Int!, $countriesLanguages: [CountriesLanguagesInput!]!) {
  assignCountriesLanguagesToUser(
    userId: $userId
    countriesLanguages: $countriesLanguages
  ) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAssignCountriesLanguagesToUserGQL extends Apollo.Mutation<IAssignCountriesLanguagesToUserMutation, IAssignCountriesLanguagesToUserMutationVariables> {
    override document = AssignCountriesLanguagesToUserDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AllocateWarehouseDocument = gql`
    mutation AllocateWarehouse($userId: Int!, $warehouses: [SelectCategory!]!) {
  allocateWarehouseToUser(userId: $userId, warehouses: $warehouses) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IAllocateWarehouseGQL extends Apollo.Mutation<IAllocateWarehouseMutation, IAllocateWarehouseMutationVariables> {
    override document = AllocateWarehouseDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
