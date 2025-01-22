import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRow,
} from '@ionic/angular/standalone';
import {
  DispatchStore,
  IGetDispatchByIdQuery,
} from '@lpg-manager/dispatch-store';
import { ScannerInputComponent } from '@lpg-manager/scanner-input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IQueryOperatorEnum, IScanAction } from '@lpg-manager/types';
import { DriverInventoryStore } from '@lpg-manager/driver-inventory-store';
import { AuthStore } from '@lpg-manager/auth-store';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';

interface SummarizedCatalogue {
  id: string;
  name: string;
  quantity: number;
}

@Component({
  selector: 'lpg-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonFooter,
    ScannerInputComponent,
    ReactiveFormsModule,
    IonRow,
    IonButtons,
    RouterLink,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonCol,
    UUIDDirective,
    IonBadge,
  ],
  providers: [DriverInventoryStore, DispatchStore],
})
export default class SummaryPageComponent {
  #fb = inject(FormBuilder);
  #authStore = inject(AuthStore);
  #driverInventoryStore = inject(DriverInventoryStore);
  #dispatchStore = inject(DispatchStore);

  driverInventories = this.#driverInventoryStore.searchedItemsEntities;

  dispatch = input<IGetDispatchByIdQuery['dispatch']>();
  dealerId = input.required<string>();

  scannerForm = this.#fb.group({ canisters: [[] as string[]] });

  dealerOrders = computed(() => {
    const orders = this.dispatch()?.consolidatedOrders.map(o => o.orders).flat() ?? [];
    const dealerId = this.dealerId();

    const filteredOrders = orders.filter(
      (order) => order.dealer.id === dealerId
    );

    const catalogueSummary: SummarizedCatalogue[] = [];

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const catalogue = item?.catalogue;
        const existingCatalogue = catalogueSummary.find(
          (c) => c.id === catalogue?.id
        );

        if (existingCatalogue) {
          existingCatalogue.quantity += item?.quantity ?? 0;
        } else {
          catalogueSummary.push({
            id: catalogue?.id as string,
            name: catalogue?.name as string,
            quantity: item?.quantity as number,
          });
        }
      });
    });

    return catalogueSummary;
  });

  totalOrderQuantity = computed(() =>
    this.dealerOrders().reduce((total, order) => total + order.quantity, 0)
  );
  scannedItems = signal([] as string[]);
  scannedDriverInventories = computed(() =>
    this.driverInventories().filter((inventory) => {
      return this.scannedItems().includes(inventory.inventoryItem.id);
    })
  );

  scanSummary = computed(() => {
    return this.dealerOrders().map((order) => {
      // Get the catalogue ID and name from the dealer order
      const catalogueId = order.id;
      const catalogueName = order.name;
      const orderQuantity = order.quantity;

      // Find how many scanned items match the dealer order catalogueId
      const scannedQuantity = this.scannedDriverInventories().length;

      // Return the summary object
      return {
        catalogueId,
        orderQuantity,
        catalogueName,
        scannedQuantity,
        status:
          orderQuantity === scannedQuantity
            ? 'OK'
            : orderQuantity > scannedQuantity
            ? 'Less'
            : 'More',
      };
    });
  });

  isAllQuantitiesMatched = computed(() => {
    const summary = this.scanSummary();
    return summary.length > 0 && summary.every((item) => item.status === 'OK');
  });

  constructor() {
    this.scannerForm
      .get('canisters')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((canisters) => {
          if (canisters) {
            this.scannedItems.set(canisters);

            if (this.totalOrderQuantity() === this.scannedItems().length) {
              this.validateScans();
            }
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  async driverToDealerConfirm() {
    const scannedCanisters = this.scannedItems(); // Assuming this holds the scanned canisters
    const dispatchId = this.dispatch()?.id as string;

    const driverInventories = this.scannedDriverInventories().map(({ id }) => ({ id }));


    await this.#dispatchStore.scanConfirm({
      dispatchId,
      inventoryItems: scannedCanisters.map((id) => ({id})),
      scanAction: IScanAction.DriverToDealerConfirmed,
      dealer: { id: this.dealerId() }
      // dispatchStatus: IDispatchStatus.InTransit,
      // driverInventories,
      // driverInventoryStatus: IScanConfirmDriverInventoryStatus.DriverToDealerConfirmed
    });
  }

  validateScans() {
    const driverRole = this.#authStore
      .user()
      ?.roles?.find((role) => role?.role?.name === 'driver');
    if (driverRole?.driver?.id) {
      this.#driverInventoryStore.setFilters([
        {
          field: 'driverId',
          value: driverRole.driver.id,
          values: [],
          operator: IQueryOperatorEnum.Equals,
        },
        {
          field: 'inventoryItemId',
          value: '',
          values: this.scannerForm.get('canisters')?.value,
          operator: IQueryOperatorEnum.In,
        },
      ]);
    }
  }
}
