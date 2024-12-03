import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type IUserFieldsFragment = { id: string, email: string, firstName: string, lastName: string, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, profilePhotoLink?: string | null };

export type IAuthDetailsFragment = { accessToken: string, refreshToken: string, refreshTokenKey: string, user?: { id: string, email: string, firstName: string, lastName: string, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, profilePhotoLink?: string | null } | null };

export type ILoginWithPasswordMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;


export type ILoginWithPasswordMutation = { loginWithPassword?: { accessToken: string, refreshToken: string, refreshTokenKey: string, user?: { id: string, email: string, firstName: string, lastName: string, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, profilePhotoLink?: string | null } | null } | null };

export type ILoginWithTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;


export type ILoginWithTokenMutation = { loginWithToken?: { accessToken: string, refreshToken: string, refreshTokenKey: string, user?: { id: string, email: string, firstName: string, lastName: string, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, profilePhotoLink?: string | null } | null } | null };

export type IRequestAccessTokenMutationVariables = Types.Exact<{
  refreshToken: Types.Scalars['String']['input'];
}>;


export type IRequestAccessTokenMutation = { requestAccessToken?: { accessToken?: string | null } | null };

export const UserFieldsFragmentDoc = gql`
    fragment UserFields on UserModel {
  id
  email
  firstName
  lastName
  phone
  createdAt
  updatedAt
  profilePhotoLink
}
    `;
export const AuthDetailsFragmentDoc = gql`
    fragment AuthDetails on LoginResponse {
  accessToken
  refreshToken
  refreshTokenKey
  user {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const LoginWithPasswordDocument = gql`
    mutation LoginWithPassword($email: String!, $password: String!) {
  loginWithPassword(email: $email, password: $password) {
    ...AuthDetails
  }
}
    ${AuthDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ILoginWithPasswordGQL extends Apollo.Mutation<ILoginWithPasswordMutation, ILoginWithPasswordMutationVariables> {
    override document = LoginWithPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginWithTokenDocument = gql`
    mutation LoginWithToken($token: String!) {
  loginWithToken(token: $token) {
    ...AuthDetails
  }
}
    ${AuthDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ILoginWithTokenGQL extends Apollo.Mutation<ILoginWithTokenMutation, ILoginWithTokenMutationVariables> {
    override document = LoginWithTokenDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RequestAccessTokenDocument = gql`
    mutation RequestAccessToken($refreshToken: String!) {
  requestAccessToken(refreshToken: $refreshToken) {
    accessToken
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IRequestAccessTokenGQL extends Apollo.Mutation<IRequestAccessTokenMutation, IRequestAccessTokenMutationVariables> {
    override document = RequestAccessTokenDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }