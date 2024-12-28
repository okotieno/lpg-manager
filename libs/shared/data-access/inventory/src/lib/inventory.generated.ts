import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateInventoryMutationVariables = Types.Exact<{
  params: Types.ICreateInventoryInput;
}>;


export type ICreateInventoryMutation = { createInventory?: { message: string, data: { id: string } } | null };

export type IGetInventoryByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetInventoryByIdQuery = { inventory?: { id: string } | null };

export type IGetInventoriesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetInventoriesQuery = { inventories: { items?: Array<{ id: string } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteInventoryByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteInventoryByIdMutation = { deleteInventory?: { message: string } | null };

export type IUpdateInventoryMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateInventoryInput;
}>;


export type IUpdateInventoryMutation = { updateInventory?: { message: string, data: { id: string } } | null };

export const CreateInventoryDocument = gql`
    mutation CreateInventory($params: CreateInventoryInput!) {
  createInventory(params: $params) {
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
  export class ICreateInventoryGQL extends Apollo.Mutation<ICreateInventoryMutation, ICreateInventoryMutationVariables> {
    override document = CreateInventoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInventoryByIdDocument = gql`
    query GetInventoryById($id: UUID!) {
  inventory(id: $id) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetInventoryByIdGQL extends Apollo.Query<IGetInventoryByIdQuery, IGetInventoryByIdQueryVariables> {
    override document = GetInventoryByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInventoriesDocument = gql`
    query GetInventories($query: QueryParams) {
  inventories(query: $query) {
    items {
      id
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
  export class IGetInventoriesGQL extends Apollo.Query<IGetInventoriesQuery, IGetInventoriesQueryVariables> {
    override document = GetInventoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteInventoryByIdDocument = gql`
    mutation DeleteInventoryById($id: UUID!) {
  deleteInventory(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteInventoryByIdGQL extends Apollo.Mutation<IDeleteInventoryByIdMutation, IDeleteInventoryByIdMutationVariables> {
    override document = DeleteInventoryByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateInventoryDocument = gql`
    mutation UpdateInventory($id: UUID!, $params: UpdateInventoryInput!) {
  updateInventory(id: $id, params: $params) {
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
  export class IUpdateInventoryGQL extends Apollo.Mutation<IUpdateInventoryMutation, IUpdateInventoryMutationVariables> {
    override document = UpdateInventoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }