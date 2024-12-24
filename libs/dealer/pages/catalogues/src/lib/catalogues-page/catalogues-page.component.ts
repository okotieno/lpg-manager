import { Component, computed, inject } from '@angular/core';
import {
  CataloguesStore,
  IGetCataloguesQuery,
} from '@lpg-manager/catalogue-store';
import {
  GET_ITEMS_INCLUDE_FIELDS,
  PaginatedResource,
} from '@lpg-manager/data-table';
import {
  IonButton, IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonSearchbar,
  IonText,
  ModalController,
  AlertController
} from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';
import { CartStore, IGetCartsQuery, AddToCartDialogComponent } from '@lpg-manager/cart-store';

type IGetItemQuery = NonNullable<IGetCataloguesQuery['catalogues']['items']>[number]

type ICatalogueDisplay = IGetItemQuery & { cart?: NonNullable<IGetCartsQuery['carts']['items']>[number] }

@Component({
  selector: 'lpg-catalogues',
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonText,
    IonImg,
    CurrencyPipe,
    IonSearchbar,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
    IonButton,
    IonButtons,
  ],
  templateUrl: './catalogues-page.component.html',
  styleUrl: './catalogues-page.component.scss',
  providers: [
    CataloguesStore,
    {
      provide: GET_ITEMS_INCLUDE_FIELDS,
      useValue: {
        includeBrand: true,
        includeDescription: true,
        includePricePerUnit: true,
      },
    },
  ],
})
export default class CataloguesPageComponent {
  #cartStore = inject(CartStore);
  #modalCtrl = inject(ModalController);
  #alertController = inject(AlertController);

  cataloguesStore = inject(CataloguesStore) as PaginatedResource<
    NonNullable<NonNullable<IGetCataloguesQuery['catalogues']['items']>[number]>
  >;
  cartCatalogueItems = computed(() => this.#cartStore.cart?.()?.items ?? []);
  catalogues = this.cataloguesStore.items;
  cataloguesDisplayed = computed<any>(() => {
    const cartCatalogueItems = this.cartCatalogueItems();
    const catalogues = this.catalogues();

    console.log({ cartCatalogueItems, catalogues });
    return catalogues.map((catalog) => {
      const cartCatalogueItem = cartCatalogueItems.find(
        (item) => item?.catalogueId === catalog?.id
      );
      console.log({ cartCatalogueItem });
      return { ...catalog, cart: cartCatalogueItem } as ICatalogueDisplay;
    });
  });

  handleSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    // Implement search functionality through your store
    this.cataloguesStore.setSearchTerm(searchTerm);
  }

  async addToCart(
    catalogue?: NonNullable<IGetCataloguesQuery['catalogues']['items']>[number]
  ) {
    const modal = await this.#modalCtrl.create({
      component: AddToCartDialogComponent,
      componentProps: {
        catalogue,
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.#cartStore.addItem(data.catalogueId, data.quantity);
    }
  }

  async updateQuantity(catalogue: ICatalogueDisplay, increment: boolean) {
    const cartItem = catalogue.cart as NonNullable<NonNullable<IGetCartsQuery['carts']['items']>[number]>['items'][number];
    if (!cartItem) return;

    const newQuantity = increment ? cartItem.quantity + 1 : cartItem.quantity - 1;
    if (newQuantity < 1) return;

    await this.#cartStore.updateQuantity(cartItem.id, newQuantity);
  }

  async removeFromCart(catalogue: ICatalogueDisplay) {
    const cartItem = catalogue.cart;
    if (!cartItem) return;

    const alert = await this.#alertController.create({
      header: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: async () => {
            await this.#cartStore.removeItem(cartItem.id);
          }
        }
      ]
    });

    await alert.present();
  }
}
