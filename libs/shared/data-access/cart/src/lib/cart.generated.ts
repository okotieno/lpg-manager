import * as Types from '@lpg-manager/types';

import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

export type ICartFragmentFragment = {
  id: string;
  totalQuantity?: number | null;
  totalPrice?: number | null;
  items: Array<{
    id: string;
    createdAt: string;
    catalogueId: string;
    quantity: number;
    catalogue: {
      id: string;
      name: string;
      pricePerUnit?: number | null;
      unit: Types.ICatalogueUnit;
      quantityPerUnit: number;
    };
    inventory: { quantity: number; station: { name: string } };
  } | null>;
};

export type IGetCartsQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetCartsQuery = { carts: { items?: Array<{ id: string, totalQuantity?: number | null, totalPrice?: number | null, items: Array<{ id: string, createdAt: string, catalogueId: string, quantity: number, catalogue: { id: string, name: string, pricePerUnit?: number | null, unit: Types.ICatalogueUnit, quantityPerUnit: number }, inventory: { quantity: number, station: { name: string } } } | null> } | null> | null, meta?: { totalItems: number } | null } };

export type IGetCartQueryVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
}>;


export type IGetCartQuery = { cart?: { id: string, totalQuantity?: number | null, totalPrice?: number | null, items: Array<{ id: string, createdAt: string, catalogueId: string, quantity: number, catalogue: { id: string, name: string, pricePerUnit?: number | null, unit: Types.ICatalogueUnit, quantityPerUnit: number }, inventory: { quantity: number, station: { name: string } } } | null> } | null };

export type ICreateCartMutationVariables = Types.Exact<{
  params?: Types.InputMaybe<Types.ICreateCartInput>;
}>;


export type ICreateCartMutation = { createCart: { message: string, data: { id: string, totalQuantity?: number | null, totalPrice?: number | null, items: Array<{ id: string, createdAt: string, catalogueId: string, quantity: number, catalogue: { id: string, name: string, pricePerUnit?: number | null, unit: Types.ICatalogueUnit, quantityPerUnit: number }, inventory: { quantity: number, station: { name: string } } } | null> } } };

export type IAddItemToCartMutationVariables = Types.Exact<{
  cartId?: Types.InputMaybe<Types.Scalars['UUID']['input']>;
  inventoryId: Types.Scalars['UUID']['input'];
  quantity: Types.Scalars['Int']['input'];
}>;


export type IAddItemToCartMutation = { addItemToCart: { message: string, data: { id: string, totalQuantity?: number | null, totalPrice?: number | null, items: Array<{ id: string, createdAt: string, catalogueId: string, quantity: number, catalogue: { id: string, name: string, pricePerUnit?: number | null, unit: Types.ICatalogueUnit, quantityPerUnit: number }, inventory: { quantity: number, station: { name: string } } } | null> } } };

export type IRemoveItemFromCartMutationVariables = Types.Exact<{
  cartId: Types.Scalars['UUID']['input'];
  cartCatalogueId: Types.Scalars['UUID']['input'];
}>;


export type IRemoveItemFromCartMutation = { removeItemFromCart: { message: string, data: { id: string, totalQuantity?: number | null, totalPrice?: number | null, items: Array<{ id: string, createdAt: string, catalogueId: string, quantity: number, catalogue: { id: string, name: string, pricePerUnit?: number | null, unit: Types.ICatalogueUnit, quantityPerUnit: number }, inventory: { quantity: number, station: { name: string } } } | null> } } };

export type IUpdateItemQuantityMutationVariables = Types.Exact<{
  cartId: Types.Scalars['UUID']['input'];
  cartCatalogueId: Types.Scalars['UUID']['input'];
  quantity: Types.Scalars['Int']['input'];
}>;


export type IUpdateItemQuantityMutation = { updateItemQuantity: { message: string, data: { id: string, totalQuantity?: number | null, totalPrice?: number | null, items: Array<{ id: string, createdAt: string, catalogueId: string, quantity: number, catalogue: { id: string, name: string, pricePerUnit?: number | null, unit: Types.ICatalogueUnit, quantityPerUnit: number }, inventory: { quantity: number, station: { name: string } } } | null> } } };

export type ICompleteCartMutationVariables = Types.Exact<{
  cartId: Types.Scalars['UUID']['input'];
}>;


export type ICompleteCartMutation = { completeCart: { message: string, data: { id: string } } };

export const CartFragmentFragmentDoc = gql`
    fragment cartFragment on CartModel {
  id
  totalQuantity
  totalPrice
  items {
    id
    createdAt
    catalogueId
    quantity
    catalogue {
      id
      name
      pricePerUnit
      unit
      quantityPerUnit
    }
    inventory {
      quantity
      station {
        name
      }
    }
  }
}
    `;
export const GetCartsDocument = gql`
    query GetCarts($query: QueryParams) {
  carts(query: $query) {
    items {
      ...cartFragment
    }
    meta {
      totalItems
    }
  }
}
    ${CartFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetCartsGQL extends Apollo.Query<IGetCartsQuery, IGetCartsQueryVariables> {
    override document = GetCartsDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCartDocument = gql`
    query GetCart($id: UUID!) {
  cart(id: $id) {
    ...cartFragment
  }
}
    ${CartFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetCartGQL extends Apollo.Query<IGetCartQuery, IGetCartQueryVariables> {
    override document = GetCartDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateCartDocument = gql`
    mutation CreateCart($params: CreateCartInput) {
  createCart(params: $params) {
    message
    data {
      ...cartFragment
    }
  }
}
    ${CartFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class ICreateCartGQL extends Apollo.Mutation<ICreateCartMutation, ICreateCartMutationVariables> {
    override document = CreateCartDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddItemToCartDocument = gql`
    mutation AddItemToCart($cartId: UUID, $inventoryId: UUID!, $quantity: Int!) {
  addItemToCart(cartId: $cartId, inventoryId: $inventoryId, quantity: $quantity) {
    message
    data {
      ...cartFragment
    }
  }
}
    ${CartFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IAddItemToCartGQL extends Apollo.Mutation<IAddItemToCartMutation, IAddItemToCartMutationVariables> {
    override document = AddItemToCartDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveItemFromCartDocument = gql`
    mutation RemoveItemFromCart($cartId: UUID!, $cartCatalogueId: UUID!) {
  removeItemFromCart(cartId: $cartId, cartCatalogueId: $cartCatalogueId) {
    message
    data {
      ...cartFragment
    }
  }
}
    ${CartFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IRemoveItemFromCartGQL extends Apollo.Mutation<IRemoveItemFromCartMutation, IRemoveItemFromCartMutationVariables> {
    override document = RemoveItemFromCartDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateItemQuantityDocument = gql`
    mutation UpdateItemQuantity($cartId: UUID!, $cartCatalogueId: UUID!, $quantity: Int!) {
  updateItemQuantity(
    cartId: $cartId
    cartCatalogueId: $cartCatalogueId
    quantity: $quantity
  ) {
    message
    data {
      ...cartFragment
    }
  }
}
    ${CartFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IUpdateItemQuantityGQL extends Apollo.Mutation<IUpdateItemQuantityMutation, IUpdateItemQuantityMutationVariables> {
    override document = UpdateItemQuantityDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CompleteCartDocument = gql`
    mutation CompleteCart($cartId: UUID!) {
  completeCart(cartId: $cartId) {
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
  export class ICompleteCartGQL extends Apollo.Mutation<ICompleteCartMutation, ICompleteCartMutationVariables> {
    override document = CompleteCartDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
