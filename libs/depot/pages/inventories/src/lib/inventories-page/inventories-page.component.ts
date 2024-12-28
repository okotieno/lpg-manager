import {
  Component,
  computed,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import {
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonContent,
} from '@ionic/angular/standalone';
import { InventoryStore } from '@lpg-manager/inventory-store';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { AuthStore } from '@lpg-manager/auth-store';
import { IQueryOperatorEnum } from '@lpg-manager/types';

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
    JsonPipe,
  ],
  templateUrl: './inventories-page.component.html',
  providers: [InventoryStore],
})
export default class InventoriesPageComponent {
  inventoryStore = inject(InventoryStore);
  readonly #authStore = inject(AuthStore);
  activeRole = this.#authStore.activeRole;
  activeStation = this.#authStore.activeStation;
  activeStationChangeEffect = effect(() => {
    const activeStationId = this.activeStation()?.id;
    untracked(() => {
      if(activeStationId) {
        this.inventoryStore.setFilters([
          { operator: IQueryOperatorEnum.Equals, value: activeStationId, field: 'stationId', values: [] },
        ]);
      }

    });
  });

  inventories = computed(
    () => this.inventoryStore.searchedItemsEntities() as any
  );

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

  async handleInfiniteScroll() {
    this.inventoryStore.fetchNextPage();
  }

  async manageInventory(inventoryId: string) {
    // Implement inventory management logic
  }
}
