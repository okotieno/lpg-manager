import { Component, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonFooter,
  IonBadge,
  IonItemDivider, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';
import {
  DispatchStore,
  IGetDispatchByIdQuery,
} from '@lpg-manager/dispatch-store';
import { ScannerInputComponent } from '@lpg-manager/scanner-input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { InventoryItemStore } from '@lpg-manager/inventory-item-store';
import { IQueryOperatorEnum } from '@lpg-manager/types';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';

interface ScanSummaryItem {
  catalogueId: string;
  catalogueName: string;
  orderQuantity: number;
  scannedQuantity: number;
  status: 'OK' | 'Less' | 'More';
}

@Component({
  selector: 'lpg-assign-load',
  standalone: true,
  imports: [
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonFooter,
    IonItemDivider,
    IonBadge,
    ReactiveFormsModule,
    JsonPipe,
    ScannerInputComponent,
    IonButton,
    UUIDDirective,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
  ],
  templateUrl: './assign-load.component.html',
  styleUrl: './assign-load.component.scss',
  providers: [DispatchStore, InventoryItemStore],
})
export default class AssignLoadComponent {
  #route = inject(ActivatedRoute);
  #inventoryItemStore = inject(InventoryItemStore);
  searchedInventoryItem = this.#inventoryItemStore.searchedItemsEntities;
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #dispatchStore = inject(DispatchStore);
  scannerForm = this.#fb.group({
    canisters: [
      [
        'cd14e9e1-220a-41eb-ba3b-915d062e7aec',
        '656429d9-06b9-4adb-aef3-b69ec3e1308c',
        '03880912-2071-4953-8440-7e3f00fbd19a',
      ] as string[],
    ],
  });

  scannedCanisters = signal([] as string[]);
  validatedScannedCanisters = computed(() => {
    return this.scannedCanisters().map((canisterId) => ({
      scannedId: canisterId,
      ...this.searchedInventoryItem().find((item) => item.id === canisterId),
    }));
  });

  dispatch = input.required<IGetDispatchByIdQuery['dispatch']>();

  async confirmAssignment() {
    const dispatchId = this.dispatch()?.id;
    if (dispatchId) {
      // await this.#dispatchStore.updateDispatchStatus(dispatchId, 'IN_TRANSIT');
      // await this.#router.navigate(['../'], { relativeTo: this.#route });
    }
  }

  scanSummary = computed(() => {
    const dispatch = this.dispatch();
    if (!dispatch) return [];

    // Create a map to count ordered quantities by catalogue
    const orderQuantities = new Map<string, number>();
    dispatch.orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item?.catalogue) {
          const current = orderQuantities.get(item.catalogue.id as string) || 0;
          orderQuantities.set(
            item.catalogue.id as string,
            current + (item.quantity ?? 0)
          );
        }
      });
    });

    // Create a map to count scanned quantities by catalogue
    const scannedQuantities = new Map<string, number>();
    this.validatedScannedCanisters().forEach((scan) => {
      if (scan.inventory?.catalogue) {
        const current = scannedQuantities.get(scan.inventory.catalogue.id) || 0;
        scannedQuantities.set(scan.inventory.catalogue.id, current + 1);
      }
    });

    // Create summary items
    const summary: ScanSummaryItem[] = [];
    orderQuantities.forEach((orderQty, catalogueId) => {
      const scannedQty = scannedQuantities.get(catalogueId) || 0;
      const catalogue = dispatch.orders
        .flatMap((o) => o.items)
        .find((i) => i?.catalogue?.id === catalogueId)?.catalogue;

      if (catalogue) {
        summary.push({
          catalogueId: catalogueId,
          catalogueName: catalogue.name,
          orderQuantity: orderQty,
          scannedQuantity: scannedQty,
          status:
            orderQty === scannedQty
              ? 'OK'
              : orderQty > scannedQty
              ? 'Less'
              : 'More',
        });
      }
    });

    return summary;
  });

  validateScans() {
    this.#inventoryItemStore.setFilters([
      {
        field: 'id',
        value: '',
        values: this.scannerForm.get('canisters')?.value,
        operator: IQueryOperatorEnum.In,
      },
    ]);
    this.scannedCanisters.set(this.scannerForm.get('canisters')?.value ?? []);
  }
}
