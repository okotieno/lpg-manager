import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateInventoryChangeMutationVariables = Types.Exact<{
  params: Types.ICreateInventoryChangeInput;
}>;


export type ICreateInventoryChangeMutation = { createInventoryChange?: { message: string, data: { id: string } } | null };

export type IGetInventoryChangeByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetInventoryChangeByIdQuery = { inventoryChange?: { id: string } | null };

export type IGetInventoryChangesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetInventoryChangesQuery = { inventoryChanges: { items?: Array<{ id: string, quantity: number } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteInventoryChangeByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteInventoryChangeByIdMutation = { deleteInventoryChange: { message: string } };

export type IUpdateInventoryChangeMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateInventoryChangeInput;
}>;


export type IUpdateInventoryChangeMutation = { updateInventoryChange?: { message: string, data: { id: string } } | null };

export const CreateInventoryChangeDocument = gql`
    mutation CreateInventoryChange($params: CreateInventoryChangeInput!) {
  createInventoryChange(params: $params) {
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
  export class ICreateInventoryChangeGQL extends Apollo.Mutation<ICreateInventoryChangeMutation, ICreateInventoryChangeMutationVariables> {
    override document = CreateInventoryChangeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInventoryChangeByIdDocument = gql`
    query GetInventoryChangeById($id: UUID!) {
  inventoryChange(id: $id) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetInventoryChangeByIdGQL extends Apollo.Query<IGetInventoryChangeByIdQuery, IGetInventoryChangeByIdQueryVariables> {
    override document = GetInventoryChangeByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInventoryChangesDocument = gql`
    query GetInventoryChanges($query: QueryParams) {
  inventoryChanges(query: $query) {
    items {
      id
      quantity
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
  export class IGetInventoryChangesGQL extends Apollo.Query<IGetInventoryChangesQuery, IGetInventoryChangesQueryVariables> {
    override document = GetInventoryChangesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteInventoryChangeByIdDocument = gql`
    mutation DeleteInventoryChangeById($id: UUID!) {
  deleteInventoryChange(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteInventoryChangeByIdGQL extends Apollo.Mutation<IDeleteInventoryChangeByIdMutation, IDeleteInventoryChangeByIdMutationVariables> {
    override document = DeleteInventoryChangeByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateInventoryChangeDocument = gql`
    mutation UpdateInventoryChange($id: UUID!, $params: UpdateInventoryChangeInput!) {
  updateInventoryChange(id: $id, params: $params) {
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
  export class IUpdateInventoryChangeGQL extends Apollo.Mutation<IUpdateInventoryChangeMutation, IUpdateInventoryChangeMutationVariables> {
    override document = UpdateInventoryChangeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }