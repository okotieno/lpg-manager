import * as Types from '@lpg-manager/types';

import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

export type ICreateCatalogueMutationVariables = Types.Exact<{
  params: Types.ICreateCatalogueInput;
}>;


export type ICreateCatalogueMutation = { createCatalogue?: { message: string, data: { id: string } } | null };

export type IGetCatalogueByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetCatalogueByIdQuery = { catalogue?: { id: string, name: string } | null };

export type ICatalogueBrandFragmentFragment = { images?: Array<{ url?: string | null } | null> | null, brand: { name: string } };

export type IGetCataloguesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
  includeBrand?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  includeDescription?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  includePricePerUnit?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type IGetCataloguesQuery = { catalogues: { items?: Array<{ id: string, name: string, unit: Types.ICatalogueUnit, quantityPerUnit: number, pricePerUnit?: number | null, description?: string | null, images?: Array<{ url?: string | null } | null> | null, brand: { name: string } } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteCatalogueByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteCatalogueByIdMutation = { deleteCatalogue: { message: string } };

export type IUpdateCatalogueMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateCatalogueInput;
}>;


export type IUpdateCatalogueMutation = { updateCatalogue?: { message: string, data: { id: string } } | null };

export const CatalogueBrandFragmentFragmentDoc = gql`
    fragment catalogueBrandFragment on CatalogueModel {
  images {
    url
  }
  brand {
    name
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
    query GetCatalogues($query: QueryParams, $includeBrand: Boolean = false, $includeDescription: Boolean = false, $includePricePerUnit: Boolean = false) {
  catalogues(query: $query) {
    items {
      id
      name
      unit
      quantityPerUnit
      pricePerUnit @include(if: $includePricePerUnit)
      description @include(if: $includeDescription)
      ...catalogueBrandFragment @include(if: $includeBrand)
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
