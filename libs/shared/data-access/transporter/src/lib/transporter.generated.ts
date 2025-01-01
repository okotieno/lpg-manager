import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ITransporterVehiclesFragment = { vehicles?: Array<{ id: string, registrationNumber: string, capacity: number, type: string } | null> | null };

export type ITransporterDriversFragment = { drivers?: Array<{ id: string, licenseNumber: string, vehicles?: Array<{ id: string, registrationNumber: string }> | null, user: { firstName: string, lastName: string, phone?: string | null, email: string } } | null> | null };

export type ICreateTransporterMutationVariables = Types.Exact<{
  params: Types.ICreateTransporterInput;
}>;


export type ICreateTransporterMutation = { createTransporter: { message: string, data: { id: string, name: string, contactPerson: string, phone: string, createdAt: string, updatedAt: string } } };

export type IGetTransporterByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetTransporterByIdQuery = { transporter?: { id: string, name: string, contactPerson: string, phone: string, createdAt: string, updatedAt: string, drivers?: Array<{ id: string, licenseNumber: string, vehicles?: Array<{ id: string, registrationNumber: string }> | null, user: { firstName: string, lastName: string, phone?: string | null, email: string } } | null> | null, vehicles?: Array<{ id: string, registrationNumber: string, capacity: number, type: string } | null> | null } | null };

export type IGetTransportersQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetTransportersQuery = { transporters: { items?: Array<{ id: string, name: string, contactPerson: string, phone: string, createdAt: string, updatedAt: string } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteTransporterByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteTransporterByIdMutation = { deleteTransporter: { message: string } };

export type IUpdateTransporterMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateTransporterInput;
}>;


export type IUpdateTransporterMutation = { updateTransporter: { message: string, data: { id: string, name: string, contactPerson: string, phone: string, createdAt: string, updatedAt: string } } };

export const TransporterVehiclesFragmentDoc = gql`
    fragment transporterVehicles on TransporterModel {
  vehicles {
    id
    registrationNumber
    capacity
    type
  }
}
    `;
export const TransporterDriversFragmentDoc = gql`
    fragment transporterDrivers on TransporterModel {
  drivers {
    id
    vehicles {
      id
      registrationNumber
    }
    user {
      firstName
      lastName
      phone
      email
    }
    licenseNumber
  }
}
    `;
export const CreateTransporterDocument = gql`
    mutation CreateTransporter($params: CreateTransporterInput!) {
  createTransporter(params: $params) {
    message
    data {
      id
      name
      contactPerson
      phone
      createdAt
      updatedAt
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ICreateTransporterGQL extends Apollo.Mutation<ICreateTransporterMutation, ICreateTransporterMutationVariables> {
    override document = CreateTransporterDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTransporterByIdDocument = gql`
    query GetTransporterById($id: UUID!) {
  transporter(id: $id) {
    id
    name
    contactPerson
    phone
    createdAt
    updatedAt
    ...transporterDrivers
    ...transporterVehicles
  }
}
    ${TransporterDriversFragmentDoc}
${TransporterVehiclesFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetTransporterByIdGQL extends Apollo.Query<IGetTransporterByIdQuery, IGetTransporterByIdQueryVariables> {
    override document = GetTransporterByIdDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTransportersDocument = gql`
    query GetTransporters($query: QueryParams) {
  transporters(query: $query) {
    items {
      id
      name
      contactPerson
      phone
      createdAt
      updatedAt
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
  export class IGetTransportersGQL extends Apollo.Query<IGetTransportersQuery, IGetTransportersQueryVariables> {
    override document = GetTransportersDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteTransporterByIdDocument = gql`
    mutation DeleteTransporterById($id: UUID!) {
  deleteTransporter(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteTransporterByIdGQL extends Apollo.Mutation<IDeleteTransporterByIdMutation, IDeleteTransporterByIdMutationVariables> {
    override document = DeleteTransporterByIdDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateTransporterDocument = gql`
    mutation UpdateTransporter($id: UUID!, $params: UpdateTransporterInput!) {
  updateTransporter(id: $id, params: $params) {
    message
    data {
      id
      name
      contactPerson
      phone
      createdAt
      updatedAt
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IUpdateTransporterGQL extends Apollo.Mutation<IUpdateTransporterMutation, IUpdateTransporterMutationVariables> {
    override document = UpdateTransporterDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
