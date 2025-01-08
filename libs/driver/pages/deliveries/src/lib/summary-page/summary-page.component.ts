import { Component, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonButton, IonButtons,
  IonContent, IonFooter,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader, IonRow
} from '@ionic/angular/standalone';
import { IGetDispatchByIdQuery } from '@lpg-manager/dispatch-store';
import { JsonPipe } from '@angular/common';
import { ScannerInputComponent } from '@lpg-manager/scanner-input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

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
  ],
})
export default class SummaryPageComponent {
  #fb = inject(FormBuilder);
  dispatch = input<IGetDispatchByIdQuery['dispatch']>();
  dealerId = input<string>();

  isAllQuantitiesMatched = signal(false);

  scannerForm = this.#fb.group({
    canisters: [
      [
        'cd14e9e1-220a-41eb-ba3b-915d062e7aec',
        '656429d9-06b9-4adb-aef3-b69ec3e1308c',
        '03880912-2071-4953-8440-7e3f00fbd19a',
      ] as string[],
    ],
  });

  dealerOrders = computed(() => {
    const orders = this.dispatch()?.orders ?? [];
    const dealerId = this.dealerId();

    const filteredOrders = orders.filter(
      (order) => order.dealer.id === dealerId
    );

    console.log({ filteredOrders });

    // Initialize an array to store the summarized catalogues
    const catalogueSummary: SummarizedCatalogue[] = [];

    // Process each filtered order and summarize the catalogues
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const catalogue = item?.catalogue;
        // Find if the catalogue already exists in the summary
        const existingCatalogue = catalogueSummary.find(
          (c) => c.id === catalogue?.id
        );

        if (existingCatalogue) {
          // If the catalogue exists, sum the quantities
          existingCatalogue.quantity += item?.quantity ?? 0;
        } else {
          // Otherwise, create a new entry for the catalogue
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
  // #dispatchStore = inject(DispatchStore);
  stationId: string;

  // orders: any[]; // Replace with the appropriate type

  constructor(private route: ActivatedRoute) {
    this.stationId = this.route.snapshot.paramMap.get('stationId')!;
    // this.orders = this.#dispatchStore.getOrdersByStation(this.stationId);
  }

  driverToDealerConfirm() {
    // Logic to initiate scanning
  }

  validateScans() {}
}
