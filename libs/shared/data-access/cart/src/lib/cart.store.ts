import {
  computed,
  inject,
  resource,
  ResourceStatus,
  untracked,
} from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ICartCatalogueInput, IQueryOperatorEnum } from '@lpg-manager/types';
import {
  IAddItemToCartGQL,
  IRemoveItemFromCartGQL,
  IUpdateItemQuantityGQL,
  IGetCartGQL,
  ICreateCartGQL,
  IGetCartsGQL,
  IGetCartsQuery,
  ICompleteCartGQL,
} from './cart.generated';
import { lastValueFrom, tap } from 'rxjs';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';
import { rxResource } from '@angular/core/rxjs-interop';

interface CartState {
  cart?: NonNullable<IGetCartsQuery['carts']['items']>[number];
  items: ICartCatalogueInput[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  cart: undefined,
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    _getCartsGQL: inject(IGetCartsGQL),
    _createCartGQL: inject(ICreateCartGQL),
    _addItemToCartGQL: inject(IAddItemToCartGQL),
    _removeItemFromCartGQL: inject(IRemoveItemFromCartGQL),
    _updateItemQuantityGQL: inject(IUpdateItemQuantityGQL),
    _getCartGQL: inject(IGetCartGQL),
    _completeCartGQL: inject(ICompleteCartGQL),
  })),
  withComputed((store) => ({
    cartItems: computed(() => store.items()),
    cartItemsCount: computed(() => store.cart?.()?.items.length ?? 0),
    cartId: computed(() => store.cart?.()?.id),
    cartTotal: computed(() => store.totalPrice()),
    itemCount: computed(() => store.totalQuantity()),
  })),
  withProps((store) => ({
    _loadCart: rxResource({
      loader: () =>
        store._getCartsGQL
          .fetch({
            query: {
              pageSize: 1,
              filters: [
                {
                  operator: IQueryOperatorEnum.Equals,
                  value: 'PENDING',
                  values: [],
                  field: 'status',
                },
              ],
            },
          })
          .pipe(
            tap((res) => {
              untracked(() => {
                if (res.data.carts.items?.[0]) {
                  patchState(store, { cart: res.data.carts.items[0] });
                }
              });
            })
          ),
    }),
    _createCartResource: resource({
      request: () => ({
        items: store.items(),
      }),
      loader: ({ request, previous }) => {
        if (store.cartId() || previous.status === ResourceStatus.Idle) {
          return Promise.resolve(undefined);
        }
        return lastValueFrom(
          store._createCartGQL
            .mutate(
              {
                params: {
                  items: [...request.items],
                },
              },
              {
                context: {
                  [SHOW_SUCCESS_MESSAGE]: true,
                  [SHOW_ERROR_MESSAGE]: true,
                },
              }
            )
            .pipe(
              tap((res) => {
                untracked(() => {
                  if (res.data?.createCart.data) {
                    patchState(store, { cart: res.data?.createCart.data });
                  }
                });
              })
            )
        );
      },
    }),
    _addToCartResource: resource({
      request: () => ({
        items: store.items(),
      }),
      loader: ({ request, previous }) => {
        if (!store.cartId() || previous.status === ResourceStatus.Idle) {
          return Promise.resolve(undefined);
        }
        return lastValueFrom(
          store._addItemToCartGQL
            .mutate(
              {
                cartId: store.cartId(),
                catalogueId: request.items[0].catalogueId,
                quantity: request.items[0].quantity,
              },
              {
                context: {
                  [SHOW_SUCCESS_MESSAGE]: true,
                  [SHOW_ERROR_MESSAGE]: true,
                },
              }
            )
            .pipe(
              tap((res) => {
                untracked(() => {
                  if (res.data?.addItemToCart.data.items?.[0]) {
                    patchState(store, { cart: res.data?.addItemToCart.data });
                  }
                });
              })
            )
        );
      },
    }),
    _completeCartResource: resource({
      loader: ({ previous }) => {
        if (previous.status === ResourceStatus.Idle) {
          return Promise.resolve(undefined);
        }

        return lastValueFrom(
          store._completeCartGQL
            .mutate(
              { cartId: store.cartId() as string },
              {
                context: {
                  [SHOW_SUCCESS_MESSAGE]: true,
                  [SHOW_ERROR_MESSAGE]: true,
                },
              }
            )
            .pipe(
              tap((res) => {
                untracked(() => {
                  if (res.data?.completeCart.data) {
                    patchState(store, { cart: undefined });
                  }
                });
              })
            )
        );
      },
    }),
  })),
  withMethods((store) => ({
    addItem: (catalogueId: string, quantity = 1) => {
      patchState(store, {
        items: [{ id: crypto.randomUUID(), catalogueId, quantity }],
      });
    },
    async removeItem(cartCatalogueId: string) {
      if (!store.cartId()) return;

      return lastValueFrom(
        store._removeItemFromCartGQL
          .mutate(
            {
              cartId: store.cartId() as string,
              cartCatalogueId,
            },
            {
              context: {
                [SHOW_SUCCESS_MESSAGE]: true,
                [SHOW_ERROR_MESSAGE]: true,
              },
            }
          )
          .pipe(
            tap((res) => {
              untracked(() => {
                if (res.data?.removeItemFromCart.data) {
                  patchState(store, { cart: res.data.removeItemFromCart.data });
                }
              });
            })
          )
      );
    },
    async updateQuantity(cartCatalogueId: string, quantity: number) {
      if (!store.cartId()) return;

      return lastValueFrom(
        store._updateItemQuantityGQL
          .mutate(
            {
              cartId: store.cartId() as string,
              cartCatalogueId,
              quantity,
            },
            {
              context: {
                [SHOW_SUCCESS_MESSAGE]: true,
                [SHOW_ERROR_MESSAGE]: true,
              },
            }
          )
          .pipe(
            tap((res) => {
              untracked(() => {
                if (res.data?.updateItemQuantity.data) {
                  patchState(store, { cart: res.data.updateItemQuantity.data });
                }
              });
            })
          )
      );
    },
    async completeCart() {
      store._completeCartResource.reload();
    },
  }))
);
