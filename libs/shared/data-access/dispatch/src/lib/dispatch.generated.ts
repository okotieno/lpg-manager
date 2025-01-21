import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type IDispatchDriverFragmentFragment = { id: string, user: { id: string, firstName: string, lastName: string } };

export type IDealerDispatchFragmentFragment = { dealer: { id: string, name: string } };

export type ICreateDispatchMutationVariables = Types.Exact<{
  params: Types.ICreateDispatchInput;
}>;


export type ICreateDispatchMutation = { createDispatch: { message: string, data: { id: string, status: Types.IDispatchStatus, dispatchDate: string, transporterId: string, driverId: string, vehicleId: string, createdAt: string, updatedAt: string, transporter: { id: string, name: string }, driver: { id: string, user: { id: string, firstName: string, lastName: string } }, vehicle: { id: string, registrationNumber: string }, consolidatedOrders: Array<{ id: string, orders: Array<{ id: string, status: Types.IOrderStatus, totalPrice: number }> }> } } };

export type IGetDispatchByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  includeDealer?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type IGetDispatchByIdQuery = { dispatch?: { id: string, status: Types.IDispatchStatus, dispatchDate: string, transporterId: string, driverId: string, vehicleId: string, createdAt: string, updatedAt: string, transporter: { id: string, name: string }, driver: { id: string, user: { id: string, firstName: string, lastName: string } }, vehicle: { id: string, registrationNumber: string }, consolidatedOrders: Array<{ id: string, orders: Array<{ id: string, status: Types.IOrderStatus, totalPrice: number, items: Array<{ id: string, quantity: number, catalogue: { id: string, name: string, unit: Types.ICatalogueUnit, quantityPerUnit: number } } | null>, dealer: { id: string, name: string } }> }> } | null };

export type IGetDispatchesQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetDispatchesQuery = { dispatches: { items?: Array<{ id: string, status: Types.IDispatchStatus, dispatchDate: string, transporterId: string, driverId: string, vehicleId: string, createdAt: string, updatedAt: string, transporter: { id: string, name: string }, driver: { id: string, user: { id: string, firstName: string, lastName: string } }, vehicle: { id: string, registrationNumber: string }, consolidatedOrders: Array<{ id: string, orders: Array<{ id: string, status: Types.IOrderStatus, totalPrice: number }> }> } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteDispatchByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteDispatchByIdMutation = { deleteDispatch: { message: string } };

export type IUpdateDispatchMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateDispatchInput;
}>;


export type IUpdateDispatchMutation = { updateDispatch: { message: string, data: { id: string, status: Types.IDispatchStatus, dispatchDate: string, transporterId: string, driverId: string, vehicleId: string, createdAt: string, updatedAt: string, transporter: { id: string, name: string }, driver: { id: string, user: { id: string, firstName: string, lastName: string } }, vehicle: { id: string, registrationNumber: string }, consolidatedOrders: Array<{ id: string, orders: Array<{ id: string, status: Types.IOrderStatus, totalPrice: number }> }> } } };

export type IScanConfirmMutationVariables = Types.Exact<{
  params: Types.IScanConfirmInput;
}>;


export type IScanConfirmMutation = { scanConfirm: { message: string, data: { id: string, status: Types.IDispatchStatus, depotToDriverConfirmedAt?: string | null, dispatchDate: string, transporter: { id: string, name: string }, driver: { id: string, user: { id: string, firstName: string, lastName: string } }, vehicle: { id: string, registrationNumber: string }, consolidatedOrders: Array<{ id: string, orders: Array<{ id: string, status: Types.IOrderStatus, totalPrice: number }> }> } } };

export const DispatchDriverFragmentFragmentDoc = gql`
    fragment dispatchDriverFragment on DriverModel {
  id
  user {
    id
    firstName
    lastName
  }
}
    `;
export const DealerDispatchFragmentFragmentDoc = gql`
    fragment dealerDispatchFragment on OrderModel {
  dealer {
    id
    name
  }
}
    `;
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
        ...dispatchDriverFragment
      }
      vehicle {
        id
        registrationNumber
      }
      consolidatedOrders {
        id
        orders {
          id
          status
          totalPrice
        }
      }
      createdAt
      updatedAt
    }
  }
}
    ${DispatchDriverFragmentFragmentDoc}`;

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
    query GetDispatchById($id: UUID!, $includeDealer: Boolean = false) {
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
      ...dispatchDriverFragment
    }
    vehicle {
      id
      registrationNumber
    }
    consolidatedOrders {
      id
      orders {
        id
        status
        totalPrice
        ...dealerDispatchFragment @include(if: $includeDealer)
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
    }
    createdAt
    updatedAt
  }
}
    ${DispatchDriverFragmentFragmentDoc}
${DealerDispatchFragmentFragmentDoc}`;

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
        ...dispatchDriverFragment
      }
      vehicle {
        id
        registrationNumber
      }
      consolidatedOrders {
        id
        orders {
          id
          status
          totalPrice
        }
      }
      createdAt
      updatedAt
    }
    meta {
      totalItems
    }
  }
}
    ${DispatchDriverFragmentFragmentDoc}`;

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
        ...dispatchDriverFragment
      }
      vehicle {
        id
        registrationNumber
      }
      consolidatedOrders {
        id
        orders {
          id
          status
          totalPrice
        }
      }
      createdAt
      updatedAt
    }
  }
}
    ${DispatchDriverFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IUpdateDispatchGQL extends Apollo.Mutation<IUpdateDispatchMutation, IUpdateDispatchMutationVariables> {
    override document = UpdateDispatchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ScanConfirmDocument = gql`
    mutation ScanConfirm($params: ScanConfirmInput!) {
  scanConfirm(params: $params) {
    message
    data {
      id
      status
      depotToDriverConfirmedAt
      dispatchDate
      transporter {
        id
        name
      }
      driver {
        ...dispatchDriverFragment
      }
      vehicle {
        id
        registrationNumber
      }
      consolidatedOrders {
        id
        orders {
          id
          status
          totalPrice
        }
      }
    }
  }
}
    ${DispatchDriverFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IScanConfirmGQL extends Apollo.Mutation<IScanConfirmMutation, IScanConfirmMutationVariables> {
    override document = ScanConfirmDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }