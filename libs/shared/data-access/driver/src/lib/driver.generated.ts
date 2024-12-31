import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateDriverMutationVariables = Types.Exact<{
  params: Types.ICreateDriverInput;
}>;


export type ICreateDriverMutation = { createDriver: { message: string, data: { id: string } } };

export type IGetDriverByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetDriverByIdQuery = { driver?: { id: string, name: string } | null };

export type IGetDriversQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetDriversQuery = { drivers: { items?: Array<{ id: string, name: string } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteDriverByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteDriverByIdMutation = { deleteDriver: { message: string } };

export type IUpdateDriverMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateDriverInput;
}>;


export type IUpdateDriverMutation = { updateDriver: { message: string, data: { id: string } } };

export const CreateDriverDocument = gql`
    mutation CreateDriver($params: CreateDriverInput!) {
  createDriver(params: $params) {
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
  export class ICreateDriverGQL extends Apollo.Mutation<ICreateDriverMutation, ICreateDriverMutationVariables> {
    override document = CreateDriverDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDriverByIdDocument = gql`
    query GetDriverById($id: UUID!) {
  driver(id: $id) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetDriverByIdGQL extends Apollo.Query<IGetDriverByIdQuery, IGetDriverByIdQueryVariables> {
    override document = GetDriverByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDriversDocument = gql`
    query GetDrivers($query: QueryParams) {
  drivers(query: $query) {
    items {
      id
      name
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
  export class IGetDriversGQL extends Apollo.Query<IGetDriversQuery, IGetDriversQueryVariables> {
    override document = GetDriversDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteDriverByIdDocument = gql`
    mutation DeleteDriverById($id: UUID!) {
  deleteDriver(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteDriverByIdGQL extends Apollo.Mutation<IDeleteDriverByIdMutation, IDeleteDriverByIdMutationVariables> {
    override document = DeleteDriverByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateDriverDocument = gql`
    mutation UpdateDriver($id: UUID!, $params: UpdateDriverInput!) {
  updateDriver(id: $id, params: $params) {
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
  export class IUpdateDriverGQL extends Apollo.Mutation<IUpdateDriverMutation, IUpdateDriverMutationVariables> {
    override document = UpdateDriverDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }