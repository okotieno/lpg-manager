import * as Types from '@lpg-manager/types';

import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

export type ICreateStationMutationVariables = Types.Exact<{
  params: Types.ICreateStationInput;
}>;


export type ICreateStationMutation = { createStation?: { message: string, data: { id: string } } | null };

export type IGetStationByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetStationByIdQuery = { station?: { id: string, name: string, type: Types.IStationType, brands?: Array<{ name: string, id: string }> | null } | null };

export type IGetStationsQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetStationsQuery = { stations: { items?: Array<{ id: string, name: string, type: Types.IStationType } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteStationByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteStationByIdMutation = { deleteStation: { message: string } };

export type IUpdateStationMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateStationInput;
}>;


export type IUpdateStationMutation = { updateStation?: { message: string, data: { id: string } } | null };

export const CreateStationDocument = gql`
    mutation CreateStation($params: CreateStationInput!) {
  createStation(params: $params) {
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
  export class ICreateStationGQL extends Apollo.Mutation<ICreateStationMutation, ICreateStationMutationVariables> {
    override document = CreateStationDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetStationByIdDocument = gql`
    query GetStationById($id: UUID!) {
  station(id: $id) {
    id
    name
    type
    brands {
      name
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetStationByIdGQL extends Apollo.Query<IGetStationByIdQuery, IGetStationByIdQueryVariables> {
    override document = GetStationByIdDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetStationsDocument = gql`
    query GetStations($query: QueryParams) {
  stations(query: $query) {
    items {
      id
      name
      type
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
  export class IGetStationsGQL extends Apollo.Query<IGetStationsQuery, IGetStationsQueryVariables> {
    override document = GetStationsDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteStationByIdDocument = gql`
    mutation DeleteStationById($id: UUID!) {
  deleteStation(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteStationByIdGQL extends Apollo.Mutation<IDeleteStationByIdMutation, IDeleteStationByIdMutationVariables> {
    override document = DeleteStationByIdDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateStationDocument = gql`
    mutation UpdateStation($id: UUID!, $params: UpdateStationInput!) {
  updateStation(id: $id, params: $params) {
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
  export class IUpdateStationGQL extends Apollo.Mutation<IUpdateStationMutation, IUpdateStationMutationVariables> {
    override document = UpdateStationDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
