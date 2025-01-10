import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type IOrderDealerFragmentFragment = { dealer: { id: string, name: string } };

export type IDispatchDealerFragmentFragment = { dispatch?: { id: string, status: Types.IDispatchStatus, driver: { id: string, user: { firstName: string, lastName: string, phone?: string | null } }, transporter: { id: string, name: string }, vehicle: { id: string, registrationNumber: string } } | null };

export type ICreateOrderMutationVariables = Types.Exact<{
  params: Types.ICreateOrderInput;
}>;


export type ICreateOrderMutation = { createOrder: { message: string, data: { id: string } } };

export type IGetOrderByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetOrderByIdQuery = { order?: { id: string } | null };

export type IGetOrdersQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
  includeDealer?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  includeDispatch?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type IGetOrdersQuery = { orders: { items?: Array<{ id: string, createdAt: string, totalPrice: number, status: Types.IOrderStatus, depot: { name: string }, items: Array<{ id: string, quantity: number, catalogue: { pricePerUnit?: number | null, quantityPerUnit: number, unit: Types.ICatalogueUnit, id: string, name: string } } | null>, dealer: { id: string, name: string }, dispatch?: { id: string, status: Types.IDispatchStatus, driver: { id: string, user: { firstName: string, lastName: string, phone?: string | null } }, transporter: { id: string, name: string }, vehicle: { id: string, registrationNumber: string } } | null } | null> | null, meta?: { totalItems: number } | null } };

export type IDeleteOrderByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IDeleteOrderByIdMutation = { deleteOrder: { message: string } };

export type IUpdateOrderMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateOrderInput;
}>;


export type IUpdateOrderMutation = { updateOrder: { message: string, data: { id: string } } };

export type IUpdateOrderStatusMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  params: Types.IUpdateOrderStatusInput;
}>;


export type IUpdateOrderStatusMutation = { updateOrderStatus: { message: string, data: { id: string, status: Types.IOrderStatus } } };

export const OrderDealerFragmentFragmentDoc = gql`
    fragment orderDealerFragment on OrderModel {
  dealer {
    id
    name
  }
}
    `;
export const DispatchDealerFragmentFragmentDoc = gql`
    fragment dispatchDealerFragment on OrderModel {
  dispatch {
    id
    status
    driver {
      id
      user {
        firstName
        lastName
        phone
      }
    }
    transporter {
      id
      name
    }
    vehicle {
      id
      registrationNumber
    }
  }
}
    `;
export const CreateOrderDocument = gql`
    mutation CreateOrder($params: CreateOrderInput!) {
  createOrder(params: $params) {
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
  export class ICreateOrderGQL extends Apollo.Mutation<ICreateOrderMutation, ICreateOrderMutationVariables> {
    override document = CreateOrderDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetOrderByIdDocument = gql`
    query GetOrderById($id: UUID!) {
  order(id: $id) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetOrderByIdGQL extends Apollo.Query<IGetOrderByIdQuery, IGetOrderByIdQueryVariables> {
    override document = GetOrderByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetOrdersDocument = gql`
    query GetOrders($query: QueryParams, $includeDealer: Boolean = true, $includeDispatch: Boolean = true) {
  orders(query: $query) {
    items {
      id
      createdAt
      totalPrice
      status
      depot {
        name
      }
      ...orderDealerFragment @include(if: $includeDealer)
      ...dispatchDealerFragment @include(if: $includeDispatch)
      items {
        id
        quantity
        catalogue {
          pricePerUnit
          quantityPerUnit
          unit
          id
          name
        }
      }
    }
    meta {
      totalItems
    }
  }
}
    ${OrderDealerFragmentFragmentDoc}
${DispatchDealerFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetOrdersGQL extends Apollo.Query<IGetOrdersQuery, IGetOrdersQueryVariables> {
    override document = GetOrdersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOrderByIdDocument = gql`
    mutation DeleteOrderById($id: UUID!) {
  deleteOrder(id: $id) {
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IDeleteOrderByIdGQL extends Apollo.Mutation<IDeleteOrderByIdMutation, IDeleteOrderByIdMutationVariables> {
    override document = DeleteOrderByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOrderDocument = gql`
    mutation UpdateOrder($id: UUID!, $params: UpdateOrderInput!) {
  updateOrder(id: $id, params: $params) {
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
  export class IUpdateOrderGQL extends Apollo.Mutation<IUpdateOrderMutation, IUpdateOrderMutationVariables> {
    override document = UpdateOrderDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOrderStatusDocument = gql`
    mutation UpdateOrderStatus($id: UUID!, $params: UpdateOrderStatusInput!) {
  updateOrderStatus(id: $id, params: $params) {
    message
    data {
      id
      status
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IUpdateOrderStatusGQL extends Apollo.Mutation<IUpdateOrderStatusMutation, IUpdateOrderStatusMutationVariables> {
    override document = UpdateOrderStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }