import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateCatalogueMutationVariables = Types.Exact<{
  params: Types.ICreateCatalogueInput;
}>;


export type ICreateCatalogueMutation = { createCatalogue?: { message: string, data: { id: string } } | null };

export type IGetCatalogueByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetCatalogueByIdQuery = { catalogue?: { id: string, name: string } | null };

export type ICatalogueBrandFragmentFragment = { brand: { name: string, images?: Array<{ url?: string | null } | null> | null } };

export type IGetCataloguesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
  includeBrands?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type IGetCataloguesQuery = { catalogues: { items?: Array<{ id: string, name: string, brand: { name: string, images?: Array<{ url?: string | null } | null> | null } } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteCatalogueByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteCatalogueByIdMutation = { deleteCatalogue?: { message: string } | null };

export type IUpdateCatalogueMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateCatalogueInput;
}>;


export type IUpdateCatalogueMutation = { updateCatalogue?: { message: string, data: { id: string } } | null };

export const CatalogueBrandFragmentFragmentDoc = gql`
    fragment catalogueBrandFragment on CatalogueModel {
  brand {
    name
    images {
      url
    }
  }
}
    `;
export const CreateCatalogueDocument = gql`
    mutation CreateCatalogue($params: CreateCatalogueInput!) {
  createCatalogue(params: $params) {
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
  export class ICreateCatalogueGQL extends Apollo.Mutation<ICreateCatalogueMutation, ICreateCatalogueMutationVariables> {
    override document = CreateCatalogueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCatalogueByIdDocument = gql`
    query GetCatalogueById($id: UUID!) {
  catalogue(id: $id) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetCatalogueByIdGQL extends Apollo.Query<IGetCatalogueByIdQuery, IGetCatalogueByIdQueryVariables> {
    override document = GetCatalogueByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCataloguesDocument = gql`
    query GetCatalogues($query: QueryParams, $includeBrands: Boolean = false) {
  catalogues(query: $query) {
    items {
      id
      name
      ...catalogueBrandFragment @include(if: $includeBrands)
    }
    meta {
      totalItems
    }
  }
}
    ${CatalogueBrandFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetCataloguesGQL extends Apollo.Query<IGetCataloguesQuery, IGetCataloguesQueryVariables> {
    override document = GetCataloguesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteCatalogueByIdDocument = gql`
    mutation DeleteCatalogueById($id: UUID!) {
  deleteCatalogue(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteCatalogueByIdGQL extends Apollo.Mutation<IDeleteCatalogueByIdMutation, IDeleteCatalogueByIdMutationVariables> {
    override document = DeleteCatalogueByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateCatalogueDocument = gql`
    mutation UpdateCatalogue($id: UUID!, $params: UpdateCatalogueInput!) {
  updateCatalogue(id: $id, params: $params) {
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
  export class IUpdateCatalogueGQL extends Apollo.Mutation<IUpdateCatalogueMutation, IUpdateCatalogueMutationVariables> {
    override document = UpdateCatalogueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }