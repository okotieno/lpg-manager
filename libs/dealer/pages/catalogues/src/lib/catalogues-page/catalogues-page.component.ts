import {
  Component,
  computed,
  effect,
  inject,
  viewChild,
  ViewChild,
} from '@angular/core';
import {
  CataloguesStore,
  IGetCataloguesQuery,
} from '@lpg-manager/catalogue-store';
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
import { IGetInventoriesQuery, InventoryStore } from '@lpg-manager/inventory-store';

type IGetItemQuery = NonNullable<
  IGetInventoriesQuery['inventories']['items']
>[number];

type ICatalogueDisplay = IGetItemQuery & {
  cart?: NonNullable<NonNullable<IGetCartsQuery['carts']['items']>[number]>['items'][number];
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
  providers: [
    InventoryStore,
    // CataloguesStore,
    StationStore,
    {
      provide: GET_ITEMS_INCLUDE_FIELDS,
      useValue: {
        // includeBrand: true,
        // includeDescription: true,
        // includePricePerUnit: true,
      },
    },
  ],
})
export default class CataloguesPageComponent {
  infiniteScroll = viewChild(IonInfiniteScroll);
  #cartStore = inject(CartStore);
  #fb = inject(FormBuilder);
  #modalCtrl = inject(ModalController);
  #alertController = inject(AlertController);
  depotStore = inject(StationStore) as PaginatedResource<
    NonNullable<
      NonNullable<IGetStationsQuery['stations']['items']>[number]
    >
  >;
  cataloguesStore = inject(InventoryStore);
  searchForm = this.#fb.group({
    depot: [[] as ISelectCategory[]],
  });
  catalogues = computed(() => this.cataloguesStore.searchedItemsEntities());

  startRange = computed(() => {
    return Math.min(1, this.catalogues().length);
  });

  endRange = computed(() => {
    return this.catalogues().length;
  });

  totalItems = computed(() => {
    return this.cataloguesStore.totalItems();
  });

  ionInfiniteScroll = viewChild(IonInfiniteScroll);

  showInfiniteScroll = computed(
    () => this.totalItems() > this.catalogues().length
  );

  isLoadingChangeEffect = effect(async () => {
    if (!this.cataloguesStore.isLoading() && this.ionInfiniteScroll?.()) {
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

    this.searchForm.get('depot')?.valueChanges.pipe(
      tap(() => {
        this.handleDepotChange()
      })
    ).subscribe()
  }

  handleDepotChange() {
    const selectedDepot = this.searchForm.get('depot')?.value;
    if (selectedDepot) {
      this.cataloguesStore.setFilters([
        {
          field: 'depotId',
          operator: IQueryOperatorEnum.In,
          value: '',
          values: selectedDepot.map((item) => item.id),
        },
      ]);
    } else {
      this.cataloguesStore.setFilters([]);
    }
  }

  cartCatalogueItems = computed(() => this.#cartStore.cart?.()?.items ?? []);
  inventoriesDisplayed = computed(() => {
    const cartCatalogueItems = this.cartCatalogueItems();
    const catalogues = this.catalogues();

    return catalogues.map((catalog) => {
      const cartCatalogueItem = cartCatalogueItems.find(
        (item) => item?.catalogueId === catalog?.id
      );
      return { ...catalog, cart: cartCatalogueItem } as ICatalogueDisplay;
    });
  });

  handleSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
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
    this.cataloguesStore.fetchNextPage();
  }
}
