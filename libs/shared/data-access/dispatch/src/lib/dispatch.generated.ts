import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateDispatchMutationVariables = Types.Exact<{
  params: Types.ICreateDispatchInput;
}>;


export type ICreateDispatchMutation = { createDispatch: { message: string, data: { id: string } } };

export type IGetDispatchByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetDispatchByIdQuery = { dispatch?: { id: string } | null };

export type IGetDispatchesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetDispatchesQuery = { dispatches: { items?: Array<{ id: string } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteDispatchByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteDispatchByIdMutation = { deleteDispatch: { message: string } };

export type IUpdateDispatchMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateDispatchInput;
}>;


export type IUpdateDispatchMutation = { updateDispatch: { message: string, data: { id: string } } };

export const CreateDispatchDocument = gql`
    mutation CreateDispatch($params: CreateDispatchInput!) {
  createDispatch(params: $params) {
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
  export class ICreateDispatchGQL extends Apollo.Mutation<ICreateDispatchMutation, ICreateDispatchMutationVariables> {
    override document = CreateDispatchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDispatchByIdDocument = gql`
    query GetDispatchById($id: UUID!) {
  dispatch(id: $id) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetDispatchByIdGQL extends Apollo.Query<IGetDispatchByIdQuery, IGetDispatchByIdQueryVariables> {
    override document = GetDispatchByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDispatchesDocument = gql`
    query GetDispatches($query: QueryParams) {
  dispatches(query: $query) {
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
  export class IGetDispatchesGQL extends Apollo.Query<IGetDispatchesQuery, IGetDispatchesQueryVariables> {
    override document = GetDispatchesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteDispatchByIdDocument = gql`
    mutation DeleteDispatchById($id: UUID!) {
  deleteDispatch(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteDispatchByIdGQL extends Apollo.Mutation<IDeleteDispatchByIdMutation, IDeleteDispatchByIdMutationVariables> {
    override document = DeleteDispatchByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateDispatchDocument = gql`
    mutation UpdateDispatch($id: UUID!, $params: UpdateDispatchInput!) {
  updateDispatch(id: $id, params: $params) {
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
  export class IUpdateDispatchGQL extends Apollo.Mutation<IUpdateDispatchMutation, IUpdateDispatchMutationVariables> {
    override document = UpdateDispatchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }