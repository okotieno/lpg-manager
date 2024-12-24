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
  ModalController
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

  cataloguesStore = inject(CataloguesStore) as PaginatedResource<
    NonNullable<IGetCataloguesQuery['catalogues']['items']>[number]
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
}
