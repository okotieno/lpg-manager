import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
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
import { IGetDispatchByIdQuery } from '@lpg-manager/dispatch-store';
import { JsonPipe } from '@angular/common';
import { ScannerInputComponent } from '@lpg-manager/scanner-input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IQueryOperatorEnum } from '@lpg-manager/types';
import { DriverInventoryStore } from '@lpg-manager/driver-inventory-store';
import { AuthStore } from '@lpg-manager/auth-store';

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
    JsonPipe,
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
  ],
  providers: [DriverInventoryStore],
})
export default class SummaryPageComponent {
  #fb = inject(FormBuilder);
  #authStore = inject(AuthStore);
  #driverInventoryStore = inject(DriverInventoryStore);

  driverInventories = this.#driverInventoryStore.searchedItemsEntities

  dispatch = input<IGetDispatchByIdQuery['dispatch']>();
  dealerId = input<string>();

  isAllQuantitiesMatched = signal(false);

  scannerForm = this.#fb.group({ canisters: [[] as string[]] });

  dealerOrders = computed(() => {
    const orders = this.dispatch()?.orders ?? [];
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
  scannedItems = signal([] as string[]);

  constructor() {
    this.scannerForm
      .get('canisters')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((canisters) => {
          if (canisters) {
            this.scannedItems.set(canisters);
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  driverToDealerConfirm() {
    // Logic to initiate scanning
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
