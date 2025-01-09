import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateDriverInventoryMutationVariables = Types.Exact<{
  params: Types.ICreateDriverInventoryInput;
}>;


export type ICreateDriverInventoryMutation = { createDriverInventory: { message: string, data: { id: string } } };

export type IGetDriverInventoryByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetDriverInventoryByIdQuery = { driverInventory?: { id: string } | null };

export type IGetDriverInventoriesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetDriverInventoriesQuery = { driverInventories: { items?: Array<{ id: string, status: Types.IDriverInventoryStatus, inventoryItem: { id: string, inventory: { id: string, catalogue: { id: string, name: string } } } } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteDriverInventoryByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteDriverInventoryByIdMutation = { deleteDriverInventory: { message: string } };

export type IUpdateDriverInventoryMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateDriverInventoryInput;
}>;


export type IUpdateDriverInventoryMutation = { updateDriverInventory?: { message: string, data: { id: string } } | null };

export const CreateDriverInventoryDocument = gql`
    mutation CreateDriverInventory($params: CreateDriverInventoryInput!) {
  createDriverInventory(params: $params) {
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
  export class ICreateDriverInventoryGQL extends Apollo.Mutation<ICreateDriverInventoryMutation, ICreateDriverInventoryMutationVariables> {
    override document = CreateDriverInventoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDriverInventoryByIdDocument = gql`
    query GetDriverInventoryById($id: UUID!) {
  driverInventory(id: $id) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetDriverInventoryByIdGQL extends Apollo.Query<IGetDriverInventoryByIdQuery, IGetDriverInventoryByIdQueryVariables> {
    override document = GetDriverInventoryByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDriverInventoriesDocument = gql`
    query GetDriverInventories($query: QueryParams) {
  driverInventories(query: $query) {
    items {
      id
      status
      inventoryItem {
        id
        inventory {
          id
          catalogue {
            id
            name
          }
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
  export class IGetDriverInventoriesGQL extends Apollo.Query<IGetDriverInventoriesQuery, IGetDriverInventoriesQueryVariables> {
    override document = GetDriverInventoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteDriverInventoryByIdDocument = gql`
    mutation DeleteDriverInventoryById($id: UUID!) {
  deleteDriverInventory(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteDriverInventoryByIdGQL extends Apollo.Mutation<IDeleteDriverInventoryByIdMutation, IDeleteDriverInventoryByIdMutationVariables> {
    override document = DeleteDriverInventoryByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateDriverInventoryDocument = gql`
    mutation UpdateDriverInventory($id: UUID!, $params: UpdateDriverInventoryInput!) {
  updateDriverInventory(id: $id, params: $params) {
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
  export class IUpdateDriverInventoryGQL extends Apollo.Mutation<IUpdateDriverInventoryMutation, IUpdateDriverInventoryMutationVariables> {
    override document = UpdateDriverInventoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }