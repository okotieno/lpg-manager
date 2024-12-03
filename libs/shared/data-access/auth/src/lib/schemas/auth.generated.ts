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