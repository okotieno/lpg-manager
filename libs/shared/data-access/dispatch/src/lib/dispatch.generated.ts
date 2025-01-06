import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ICreateDispatchMutationVariables = Types.Exact<{
  params: Types.ICreateDispatchInput;
}>;


export type ICreateDispatchMutation = { createDispatch: { message: string, data: { id: string, status: Types.IDispatchStatus, dispatchDate: string, transporterId: string, driverId: string, vehicleId: string, createdAt: string, updatedAt: string, transporter: { id: string, name: string }, driver: { id: string, user: { firstName: string, lastName: string } }, vehicle: { id: string, registrationNumber: string }, orders: Array<{ id: string, status: Types.IOrderStatus, totalPrice: number }> } } };

export type IGetDispatchByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetDispatchByIdQuery = { dispatch?: { id: string, status: Types.IDispatchStatus, dispatchDate: string, transporterId: string, driverId: string, vehicleId: string, createdAt: string, updatedAt: string, transporter: { id: string, name: string }, driver: { id: string, user: { firstName: string, lastName: string } }, vehicle: { id: string, registrationNumber: string }, orders: Array<{ id: string, status: Types.IOrderStatus, totalPrice: number, items: Array<{ id: string, quantity: number, catalogue: { id: string, name: string, unit: Types.ICatalogueUnit, quantityPerUnit: number } } | null> }> } | null };

export type IGetDispatchesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetDispatchesQuery = { dispatches: { items?: Array<{ id: string, status: Types.IDispatchStatus, dispatchDate: string, transporterId: string, driverId: string, vehicleId: string, createdAt: string, updatedAt: string, transporter: { id: string, name: string }, driver: { id: string, user: { firstName: string, lastName: string } }, vehicle: { id: string, registrationNumber: string }, orders: Array<{ id: string, status: Types.IOrderStatus, totalPrice: number }> } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteDispatchByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteDispatchByIdMutation = { deleteDispatch: { message: string } };

export type IUpdateDispatchMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateDispatchInput;
}>;


export type IUpdateDispatchMutation = { updateDispatch: { message: string, data: { id: string, status: Types.IDispatchStatus, dispatchDate: string, transporterId: string, driverId: string, vehicleId: string, createdAt: string, updatedAt: string, transporter: { id: string, name: string }, driver: { id: string, user: { firstName: string, lastName: string } }, vehicle: { id: string, registrationNumber: string }, orders: Array<{ id: string, status: Types.IOrderStatus, totalPrice: number }> } } };

export const CreateDispatchDocument = gql`
    mutation CreateDispatch($params: CreateDispatchInput!) {
  createDispatch(params: $params) {
    message
    data {
      id
      status
      dispatchDate
      transporterId
      driverId
      vehicleId
      transporter {
        id
        name
      }
      driver {
        id
        user {
          firstName
          lastName
        }
      }
      vehicle {
        id
        registrationNumber
      }
      orders {
        id
        status
        totalPrice
      }
      createdAt
      updatedAt
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
    status
    dispatchDate
    transporterId
    driverId
    vehicleId
    transporter {
      id
      name
    }
    driver {
      id
      user {
        firstName
        lastName
      }
    }
    vehicle {
      id
      registrationNumber
    }
    orders {
      id
      status
      totalPrice
      items {
        id
        quantity
        catalogue {
          id
          name
          unit
          quantityPerUnit
        }
      }
    }
    createdAt
    updatedAt
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
      status
      dispatchDate
      transporterId
      driverId
      vehicleId
      transporter {
        id
        name
      }
      driver {
        id
        user {
          firstName
          lastName
        }
      }
      vehicle {
        id
        registrationNumber
      }
      orders {
        id
        status
        totalPrice
      }
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
      status
      dispatchDate
      transporterId
      driverId
      vehicleId
      transporter {
        id
        name
      }
      driver {
        id
        user {
          firstName
          lastName
        }
      }
      vehicle {
        id
        registrationNumber
      }
      orders {
        id
        status
        totalPrice
      }
      createdAt
      updatedAt
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