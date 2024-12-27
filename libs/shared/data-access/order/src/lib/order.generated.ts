import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type IGetOrdersQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetOrdersQuery = { orders: { items?: Array<{ id: string } | null> | null, meta?: { totalItems: number } | null } };

export const GetOrdersDocument = gql`
    query GetOrders($query: QueryParams) {
  orders(query: $query) {
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
  export class IGetOrdersGQL extends Apollo.Query<IGetOrdersQuery, IGetOrdersQueryVariables> {
    override document = GetOrdersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }