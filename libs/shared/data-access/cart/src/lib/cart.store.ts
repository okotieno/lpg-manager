import { computed, inject, resource, ResourceStatus } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ICartCatalogueInput } from '@lpg-manager/types';
import {
  IAddItemToCartGQL,
  IRemoveItemFromCartGQL,
  IUpdateItemQuantityGQL,
  IGetCartGQL,
  ICreateCartGQL,
} from './cart.generated';
import { lastValueFrom } from 'rxjs';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';

interface CartState {
  items: ICartCatalogueInput[];
  totalQuantity: number;
  totalPrice: number;
  cartId: string | null;
}

const initialState: CartState = {
  cartId: null,
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    _createCartGQL: inject(ICreateCartGQL),
    _addItemToCartGQL: inject(IAddItemToCartGQL),
    _removeItemFromCartGQL: inject(IRemoveItemFromCartGQL),
    _updateItemQuantityGQL: inject(IUpdateItemQuantityGQL),
    _getCartGQL: inject(IGetCartGQL),
  })),
  withProps((store) => ({
    _createCartResource: resource({
      request: () => ({
        cartId: store.cartId(),
        items: store.items(),
      }),
      loader: ({ request, previous }) => {
        if (request.cartId || previous.status === ResourceStatus.Idle) {
          return Promise.resolve(undefined);
        }
        return lastValueFrom(
          store._createCartGQL.mutate(
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
        );
      },
    }),
    _addToCartResource: resource({
      loader: () => {
        return lastValueFrom(
          store._addItemToCartGQL.mutate({
            cartId: '',
            catalogueId: '',
            quantity: 1,
          })
        );
      },
    }),
  })),
  withComputed((store) => ({
    cartItems: computed(() => store.items()),
    cartTotal: computed(() => store.totalPrice()),
    itemCount: computed(() => store.totalQuantity()),
  })),
  withMethods((store) => ({
    addItem: (catalogueId: string, quantity = 1) => {
      if (!store.cartId()) {
        patchState(store, {
          items: [{ id: crypto.randomUUID(), catalogueId, quantity }],
        });
        store._createCartResource.reload();
      } else {
        store._addToCartResource.reload();
      }
    },
    // async addItem(productId: string, quantity = 1) {
    //   if (!store.userId()) return;
    //
    //   const result = await addItemToCartGQL
    //     .mutate({
    //       userId: store.userId() as string,
    //       productId,
    //       quantity,
    //     })
    //     .toPromise();
    //
    //   if (result?.data?.addItemToCart) {
    //     const { items, totalQuantity, totalPrice } =
    //       result.data.addItemToCart.data;
    //     patchState(store, {
    //       items,
    //       totalQuantity,
    //       totalPrice,
    //     });
    //   }
    // },
    //
    // async removeItem(itemId: string) {
    //   if (!store.userId()) return;
    //
    //   const result = await removeItemFromCartGQL
    //     .mutate({
    //       userId: store.userId() as string,
    //       itemId,
    //     })
    //     .toPromise();
    //
    //   if (result?.data?.removeItemFromCart) {
    //     const { totalQuantity, totalPrice } =
    //       result.data.removeItemFromCart.data;
    //     const updatedItems = store
    //       .items()
    //       .filter((item) => item.catalogueId !== itemId);
    //     patchState(store, {
    //       items: updatedItems,
    //       totalQuantity,
    //       totalPrice,
    //     });
    //   }
    // },
    //
    // async updateQuantity(itemId: string, quantity: number) {
    //   if (!store.userId()) return;
    //
    //   const result = await updateItemQuantityGQL
    //     .mutate({
    //       userId: store.userId() as string,
    //       itemId,
    //       quantity,
    //     })
    //     .toPromise();
    //
    //   if (result?.data?.updateItemQuantity) {
    //     const { totalQuantity, totalPrice } =
    //       result.data.updateItemQuantity.data;
    //     const updatedItems = store
    //       .items()
    //       .map((item) =>
    //         item.catalogueId === itemId ? { ...item, quantity } : item
    //       );
    //     patchState(store, {
    //       items: updatedItems,
    //       totalQuantity,
    //       totalPrice,
    //     });
    //   }
    // },
    //
    // setUserId(userId: string) {
    //   patchState(store, { userId });
    // },
    //
    // async loadCart(cartId: string) {
    //   const result = await getCartGQL.fetch({ id: cartId }).toPromise();
    //   if (result?.data?.cart) {
    //     const { items, totalQuantity, totalPrice } = result.data.cart;
    //     patchState(store, {
    //       items,
    //       totalQuantity,
    //       totalPrice,
    //     });
    //   }
    // },
  }))
);