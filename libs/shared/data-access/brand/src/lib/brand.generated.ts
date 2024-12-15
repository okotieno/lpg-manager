import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateBrandMutationVariables = Types.Exact<{
  params: Types.ICreateBrandInput;
}>;


export type ICreateBrandMutation = { createBrand?: { message: string, data: { id: string } } | null };

export type IGetBrandByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type IGetBrandByIdQuery = { brand?: { id: string, name: string, companyName?: string | null } | null };

export type IGetBrandByIdWithPermissionQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type IGetBrandByIdWithPermissionQuery = { brand?: { id: string, name: string, companyName?: string | null } | null };

export type IGetBrandsQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetBrandsQuery = { brands: { items?: Array<{ id: string, name: string, companyName?: string | null } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteBrandByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type IDeleteBrandByIdMutation = { deleteBrand?: { message: string } | null };

export type IUpdateBrandMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  params: Types.IUpdateBrandInput;
}>;


export type IUpdateBrandMutation = { updateBrand?: { message: string, data: { id: string } } | null };

export const CreateBrandDocument = gql`
    mutation CreateBrand($params: CreateBrandInput!) {
  createBrand(params: $params) {
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
  export class ICreateBrandGQL extends Apollo.Mutation<ICreateBrandMutation, ICreateBrandMutationVariables> {
    override document = CreateBrandDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBrandByIdDocument = gql`
    query GetBrandById($id: String!) {
  brand(id: $id) {
    id
    name
    companyName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetBrandByIdGQL extends Apollo.Query<IGetBrandByIdQuery, IGetBrandByIdQueryVariables> {
    override document = GetBrandByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBrandByIdWithPermissionDocument = gql`
    query GetBrandByIdWithPermission($id: String!) {
  brand(id: $id) {
    id
    name
    companyName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetBrandByIdWithPermissionGQL extends Apollo.Query<IGetBrandByIdWithPermissionQuery, IGetBrandByIdWithPermissionQueryVariables> {
    override document = GetBrandByIdWithPermissionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBrandsDocument = gql`
    query GetBrands($query: QueryParams) {
  brands(query: $query) {
    items {
      id
      name
      companyName
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
  export class IGetBrandsGQL extends Apollo.Query<IGetBrandsQuery, IGetBrandsQueryVariables> {
    override document = GetBrandsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteBrandByIdDocument = gql`
    mutation DeleteBrandById($id: String!) {
  deleteBrand(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteBrandByIdGQL extends Apollo.Mutation<IDeleteBrandByIdMutation, IDeleteBrandByIdMutationVariables> {
    override document = DeleteBrandByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateBrandDocument = gql`
    mutation UpdateBrand($id: String!, $params: UpdateBrandInput!) {
  updateBrand(id: $id, params: $params) {
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
  export class IUpdateBrandGQL extends Apollo.Mutation<IUpdateBrandMutation, IUpdateBrandMutationVariables> {
    override document = UpdateBrandDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }