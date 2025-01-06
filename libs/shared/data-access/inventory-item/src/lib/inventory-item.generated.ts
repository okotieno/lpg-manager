import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateInventoryItemMutationVariables = Types.Exact<{
  params: Types.ICreateInventoryItemInput;
}>;


export type ICreateInventoryItemMutation = { createInventoryItem: { message: string, data: { id: string } } };

export type IGetInventoryItemByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetInventoryItemByIdQuery = { inventoryItem?: { id: string } | null };

export type IGetInventoryItemsQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetInventoryItemsQuery = { inventoryItems: { items?: Array<{ id: string, inventory: { catalogue: { id: string, name: string, unit: Types.ICatalogueUnit, quantityPerUnit: number } } } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteInventoryItemByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteInventoryItemByIdMutation = { deleteInventoryItem: { message: string } };

export type IUpdateInventoryItemMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateInventoryItemInput;
}>;


export type IUpdateInventoryItemMutation = { updateInventoryItem: { message: string, data: { id: string } } };

export const CreateInventoryItemDocument = gql`
    mutation CreateInventoryItem($params: CreateInventoryItemInput!) {
  createInventoryItem(params: $params) {
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
  export class ICreateInventoryItemGQL extends Apollo.Mutation<ICreateInventoryItemMutation, ICreateInventoryItemMutationVariables> {
    override document = CreateInventoryItemDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInventoryItemByIdDocument = gql`
    query GetInventoryItemById($id: UUID!) {
  inventoryItem(id: $id) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetInventoryItemByIdGQL extends Apollo.Query<IGetInventoryItemByIdQuery, IGetInventoryItemByIdQueryVariables> {
    override document = GetInventoryItemByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInventoryItemsDocument = gql`
    query GetInventoryItems($query: QueryParams) {
  inventoryItems(query: $query) {
    items {
      id
      inventory {
        catalogue {
          id
          name
          unit
          quantityPerUnit
        }
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
  export class IGetInventoryItemsGQL extends Apollo.Query<IGetInventoryItemsQuery, IGetInventoryItemsQueryVariables> {
    override document = GetInventoryItemsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteInventoryItemByIdDocument = gql`
    mutation DeleteInventoryItemById($id: UUID!) {
  deleteInventoryItem(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteInventoryItemByIdGQL extends Apollo.Mutation<IDeleteInventoryItemByIdMutation, IDeleteInventoryItemByIdMutationVariables> {
    override document = DeleteInventoryItemByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateInventoryItemDocument = gql`
    mutation UpdateInventoryItem($id: UUID!, $params: UpdateInventoryItemInput!) {
  updateInventoryItem(id: $id, params: $params) {
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
  export class IUpdateInventoryItemGQL extends Apollo.Mutation<IUpdateInventoryItemMutation, IUpdateInventoryItemMutationVariables> {
    override document = UpdateInventoryItemDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }