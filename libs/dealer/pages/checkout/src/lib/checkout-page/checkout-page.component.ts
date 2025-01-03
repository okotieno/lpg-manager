import { Component, computed, inject } from '@angular/core';
import { CartStore } from '@lpg-manager/cart-store';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonTitle,
} from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

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
    RouterLink,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export default class CheckoutPageComponent {
  #cartStore = inject(CartStore);
  #alertController = inject(AlertController);

  cartItems = computed(() => {
    const cartItems = [...(this.#cartStore.cart?.()?.items ?? [])];
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
    const alert = await this.#alertController.create({
      header: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: async () => {
            await this.#cartStore.removeItem(cartCatalogueId);
          },
        },
      ],
    });

    await alert.present();
  }

  async completeOrder() {
    await this.#cartStore.completeCart();
  }
}
