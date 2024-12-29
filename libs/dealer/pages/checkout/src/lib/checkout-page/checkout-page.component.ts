import { Component, computed, inject } from '@angular/core';
import { CartStore } from '@lpg-manager/cart-store';
import {
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonRow,
  IonCol,
  IonGrid,
} from '@ionic/angular/standalone';
import { CurrencyPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'lpg-checkout',
  standalone: true,
  imports: [
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonButton,
    IonIcon,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    CurrencyPipe,
    IonRow,
    IonCol,
    IonGrid,
    JsonPipe,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export default class CheckoutPageComponent {
  #cartStore = inject(CartStore);

  cartItems = computed(() => {
    const cartItems =  [...(this.#cartStore.cart?.()?.items ?? [])];
    return cartItems.sort((a, b) =>
      new Date(a?.createdAt as string) > new Date(b?.createdAt as string)
        ? 1
        : -1
    );
  });
  cartTotal = computed(() => {
    const items = this.cartItems();
    return items.reduce((total, item) => {
      if (item && item.catalogue && item.catalogue.pricePerUnit != null) {
        return total + item.catalogue.pricePerUnit * item.quantity;
      }
      return total;
    }, 0);
  });

  async updateQuantity(cartCatalogueId: string, quantity: number) {
    await this.#cartStore.updateQuantity(cartCatalogueId, quantity);
  }

  async removeItem(cartCatalogueId: string) {
    await this.#cartStore.removeItem(cartCatalogueId);
  }

  async completeOrder() {
    await this.#cartStore.completeCart();
  }
}
