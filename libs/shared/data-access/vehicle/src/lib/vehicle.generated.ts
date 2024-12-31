import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateVehicleMutationVariables = Types.Exact<{
  params: Types.ICreateVehicleInput;
}>;


export type ICreateVehicleMutation = { createVehicle: { message: string, data?: { id: string } | null } };

export type IGetVehicleByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetVehicleByIdQuery = { vehicle?: { id: string } | null };

export type IGetVehiclesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetVehiclesQuery = { vehicles: { items?: Array<{ id: string } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteVehicleByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteVehicleByIdMutation = { deleteVehicle: { message: string } };

export type IUpdateVehicleMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateVehicleInput;
}>;


export type IUpdateVehicleMutation = { updateVehicle: { message: string, data?: { id: string } | null } };

export const CreateVehicleDocument = gql`
    mutation CreateVehicle($params: CreateVehicleInput!) {
  createVehicle(params: $params) {
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
  export class ICreateVehicleGQL extends Apollo.Mutation<ICreateVehicleMutation, ICreateVehicleMutationVariables> {
    override document = CreateVehicleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetVehicleByIdDocument = gql`
    query GetVehicleById($id: UUID!) {
  vehicle(id: $id) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetVehicleByIdGQL extends Apollo.Query<IGetVehicleByIdQuery, IGetVehicleByIdQueryVariables> {
    override document = GetVehicleByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetVehiclesDocument = gql`
    query GetVehicles($query: QueryParams) {
  vehicles(query: $query) {
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
  export class IGetVehiclesGQL extends Apollo.Query<IGetVehiclesQuery, IGetVehiclesQueryVariables> {
    override document = GetVehiclesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteVehicleByIdDocument = gql`
    mutation DeleteVehicleById($id: UUID!) {
  deleteVehicle(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteVehicleByIdGQL extends Apollo.Mutation<IDeleteVehicleByIdMutation, IDeleteVehicleByIdMutationVariables> {
    override document = DeleteVehicleByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateVehicleDocument = gql`
    mutation UpdateVehicle($id: UUID!, $params: UpdateVehicleInput!) {
  updateVehicle(id: $id, params: $params) {
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
  export class IUpdateVehicleGQL extends Apollo.Mutation<IUpdateVehicleMutation, IUpdateVehicleMutationVariables> {
    override document = UpdateVehicleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }