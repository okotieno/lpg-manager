import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { IGetCataloguesQuery } from '@lpg-manager/catalogue-store';
import {
  GET_ITEMS_INCLUDE_FIELDS,
  PaginatedResource,
} from '@lpg-manager/data-table';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonImg,
  IonRow,
  IonSearchbar,
  IonText,
  ModalController,
  AlertController,
  IonItem,
  IonMenu,
  IonSplitPane,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';
import {
  CartStore,
  IGetCartsQuery,
  AddToCartDialogComponent,
} from '@lpg-manager/cart-store';
import { IGetStationsQuery, StationStore } from '@lpg-manager/station-store';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { ISelectCategory, IQueryOperatorEnum } from '@lpg-manager/types';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import {
  IGetInventoriesQuery,
  InventoryStore,
} from '@lpg-manager/inventory-store';

type IGetItemQuery = NonNullable<
  IGetInventoriesQuery['inventories']['items']
>[number];

type ICatalogueDisplay = IGetItemQuery & {
  cart?: NonNullable<
    NonNullable<IGetCartsQuery['carts']['items']>[number]
  >['items'][number];
};

@Component({
  selector: 'lpg-catalogues',
  standalone: true,
  imports: [
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
    SearchableSelectComponent,
    ReactiveFormsModule,
    IonItem,
    IonMenu,
    IonSplitPane,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
  templateUrl: './catalogues-page.component.html',
  styleUrl: './catalogues-page.component.scss',
  providers: [InventoryStore, StationStore],
})
export default class CataloguesPageComponent {
  infiniteScroll = viewChild(IonInfiniteScroll);
  #cartStore = inject(CartStore);
  #fb = inject(FormBuilder);
  #modalCtrl = inject(ModalController);
  #alertController = inject(AlertController);
  depotStore = inject(StationStore) as PaginatedResource<
    NonNullable<NonNullable<IGetStationsQuery['stations']['items']>[number]>
  >;
  inventoryStore = inject(InventoryStore);
  searchForm = this.#fb.group({
    depot: [[] as ISelectCategory[]],
  });
  inventories = computed(() => this.inventoryStore.searchedItemsEntities());

  startRange = computed(() => {
    return Math.min(1, this.inventories().length);
  });

  endRange = computed(() => {
    return this.inventories().length;
  });

  totalItems = computed(() => {
    return this.inventoryStore.totalItems();
  });

  ionInfiniteScroll = viewChild(IonInfiniteScroll);

  showInfiniteScroll = computed(
    () => this.totalItems() > this.inventories().length
  );

  isLoadingChangeEffect = effect(async () => {
    if (!this.inventoryStore.isLoading() && this.ionInfiniteScroll?.()) {
      await this.ionInfiniteScroll()?.complete();
    }
  });

  constructor() {
    // Initialize depot store with DEPOT type filter
    this.depotStore.setFilters([
      {
        field: 'type',
        operator: IQueryOperatorEnum.Equals,
        value: 'DEPOT',
        values: [],
      },
    ]);

    this.searchForm
      .get('depot')
      ?.valueChanges.pipe(
        tap(() => {
          this.handleDepotChange();
        })
      )
      .subscribe();
  }

  handleDepotChange() {
    const selectedDepot = this.searchForm.get('depot')?.value;
    if (selectedDepot) {
      this.inventoryStore.setFilters([
        {
          field: 'depotId',
          operator: IQueryOperatorEnum.In,
          value: '',
          values: selectedDepot.map((item) => item.id),
        },
      ]);
    } else {
      this.inventoryStore.setFilters([]);
    }
  }

  cartCatalogueItems = computed(() => this.#cartStore.cart?.()?.items ?? []);
  inventoriesDisplayed = computed(() => {
    const cartCatalogueItems = this.cartCatalogueItems();
    const catalogues = this.inventories();
    console.log({ cartCatalogueItems, catalogues });

    return catalogues.map((inventory) => {
      const cartCatalogueItem = cartCatalogueItems.find(
        (item) => item?.catalogueId === inventory.catalogue.id
      );
      return { ...inventory, cart: cartCatalogueItem } as ICatalogueDisplay;
    });
  });

  handleSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.inventoryStore.setSearchTerm(searchTerm);
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
    const cartItem = catalogue.cart as NonNullable<
      NonNullable<IGetCartsQuery['carts']['items']>[number]
    >['items'][number];
    if (!cartItem) return;

    const newQuantity = increment
      ? cartItem.quantity + 1
      : cartItem.quantity - 1;
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
          role: 'cancel',
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: async () => {
            await this.#cartStore.removeItem(cartItem.id);
          },
        },
      ],
    });

    await alert.present();
  }

  async handleInfiniteScroll() {
    this.inventoryStore.fetchNextPage();
  }
}
