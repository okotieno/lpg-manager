import {
  Component,
  computed,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRow,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import { InventoryStore } from '@lpg-manager/inventory-store';
import { CurrencyPipe } from '@angular/common';
import { AuthStore } from '@lpg-manager/auth-store';
import { IQueryOperatorEnum } from '@lpg-manager/types';
import InventoryManagementComponent from '../inventory-management/inventory-management.component';

@Component({
  selector: 'lpg-inventories',
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCol,
    IonRow,
    IonText,
    IonButton,
    IonIcon,
    CurrencyPipe,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonContent,
  ],
  templateUrl: './inventories-page.component.html',
  providers: [InventoryStore],
})
export default class InventoriesPageComponent {
  inventoryStore = inject(InventoryStore);
  readonly #authStore = inject(AuthStore);
  activeRole = this.#authStore.activeRole;
  activeStation = this.#authStore.activeStation;
  stationFilter = computed(() => {
    if (this.activeStation()?.id)
      return {
        operator: IQueryOperatorEnum.Equals,
        value: this.activeStation()?.id,
        field: 'stationId',
        values: [],
      };
    return;
  });
  driverFilter = computed(() => ({
    ...this.stationFilter(),
    field: 'driverId',
  }));
  activeStationChangeEffect = effect(() => {
    const stationFilter = this.stationFilter();
    untracked(() => {
      if (stationFilter) {
        this.inventoryStore.setFilters([stationFilter]);
      }
    });
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

  #modalCtrl = inject(ModalController);

  async handleInfiniteScroll() {
    this.inventoryStore.fetchNextPage();
  }

  async manageInventory(inventoryId: string) {
    // Implement inventory management logic
  }

  async addInventory() {
    const modal = await this.#modalCtrl.create({
      component: InventoryManagementComponent,
      componentProps: {
        mode: 'create',
        defaultFilters: [this.driverFilter()],
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      // Refresh the inventory list
      // this.inventoryStore.fetchFirstPage();
    }
  }
}
