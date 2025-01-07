import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type IUserFieldsFragment = { id: string, email: string, firstName: string, lastName: string, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, profilePhotoLink?: string | null, roles?: Array<{ id: string, station?: { id: string, name: string, type: Types.IStationType } | null, role?: { id: string, name: string, permissions?: Array<{ id: string, name: string } | null> | null } | null, driver?: { id: string, transporter: { id: string, name: string } } | null } | null> | null };

export type IAuthDetailsFragment = { accessToken: string, refreshToken: string, refreshTokenKey: string, user?: { id: string, email: string, firstName: string, lastName: string, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, profilePhotoLink?: string | null, roles?: Array<{ id: string, station?: { id: string, name: string, type: Types.IStationType } | null, role?: { id: string, name: string, permissions?: Array<{ id: string, name: string } | null> | null } | null, driver?: { id: string, transporter: { id: string, name: string } } | null } | null> | null } | null };

export type ILoginWithPasswordMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;


export type ILoginWithPasswordMutation = { loginWithPassword?: { accessToken: string, refreshToken: string, refreshTokenKey: string, user?: { id: string, email: string, firstName: string, lastName: string, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, profilePhotoLink?: string | null, roles?: Array<{ id: string, station?: { id: string, name: string, type: Types.IStationType } | null, role?: { id: string, name: string, permissions?: Array<{ id: string, name: string } | null> | null } | null, driver?: { id: string, transporter: { id: string, name: string } } | null } | null> | null } | null } | null };

export type ILoginWithTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;


export type ILoginWithTokenMutation = { loginWithToken?: { accessToken: string, refreshToken: string, refreshTokenKey: string, user?: { id: string, email: string, firstName: string, lastName: string, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, profilePhotoLink?: string | null, roles?: Array<{ id: string, station?: { id: string, name: string, type: Types.IStationType } | null, role?: { id: string, name: string, permissions?: Array<{ id: string, name: string } | null> | null } | null, driver?: { id: string, transporter: { id: string, name: string } } | null } | null> | null } | null } | null };

export type IRequestAccessTokenMutationVariables = Types.Exact<{
  refreshToken: Types.Scalars['String']['input'];
}>;


export type IRequestAccessTokenMutation = { requestAccessToken?: { accessToken?: string | null } | null };

export type ISendPasswordResetEmailMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;


export type ISendPasswordResetEmailMutation = { sendPasswordResetLinkEmail?: { message: string } | null };

export type IChangePasswordUsingResetTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
  passwordConfirmation: Types.Scalars['String']['input'];
}>;


export type IChangePasswordUsingResetTokenMutation = { changePasswordUsingResetToken?: { accessToken: string, refreshToken: string, user?: { id: string, email: string, firstName: string, lastName: string, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, profilePhotoLink?: string | null, roles?: Array<{ id: string, station?: { id: string, name: string, type: Types.IStationType } | null, role?: { id: string, name: string, permissions?: Array<{ id: string, name: string } | null> | null } | null, driver?: { id: string, transporter: { id: string, name: string } } | null } | null> | null } | null } | null };

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
  roles {
    id
    station {
      id
      name
      type
    }
    role {
      id
      name
      permissions {
        id
        name
      }
    }
    driver {
      id
      transporter {
        id
        name
      }
    }
  }
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
export const SendPasswordResetEmailDocument = gql`
    mutation SendPasswordResetEmail($email: String!) {
  sendPasswordResetLinkEmail(email: $email) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ISendPasswordResetEmailGQL extends Apollo.Mutation<ISendPasswordResetEmailMutation, ISendPasswordResetEmailMutationVariables> {
    override document = SendPasswordResetEmailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangePasswordUsingResetTokenDocument = gql`
    mutation ChangePasswordUsingResetToken($token: String!, $password: String!, $passwordConfirmation: String!) {
  changePasswordUsingResetToken(
    token: $token
    password: $password
    passwordConfirmation: $passwordConfirmation
  ) {
    accessToken
    refreshToken
    user {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IChangePasswordUsingResetTokenGQL extends Apollo.Mutation<IChangePasswordUsingResetTokenMutation, IChangePasswordUsingResetTokenMutationVariables> {
    override document = ChangePasswordUsingResetTokenDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }