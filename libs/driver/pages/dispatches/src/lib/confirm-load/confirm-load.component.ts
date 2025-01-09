import { Component, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import {
  DispatchStore,
  IGetDispatchByIdQuery,
} from '@lpg-manager/dispatch-store';
import { ScannerInputComponent } from '@lpg-manager/scanner-input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InventoryItemStore } from '@lpg-manager/inventory-item-store';
import { IDispatchStatus, IQueryOperatorEnum } from '@lpg-manager/types';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';
import { JsonPipe } from '@angular/common';
import { DriverInventoryStore } from '@lpg-manager/driver-inventory-store';

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
    RouterLink,
    IonText,
    JsonPipe,
  ],
  templateUrl: './confirm-load.component.html',
  styleUrl: './confirm-load.component.scss',
  providers: [DispatchStore, DriverInventoryStore],
})
export default class ConfirmLoadComponent {
  #driverInventoryStore = inject(DriverInventoryStore);
  selectedDriverInventoryItems =
    this.#driverInventoryStore.items;
  #fb = inject(FormBuilder);
  #dispatchStore = inject(DispatchStore);
  scannerForm = this.#fb.group({
    canisters: [[] as string[]],
  });

  scannedCanisters = signal([] as string[]);
  validatedScannedCanisters = computed(() => {
    const scannedCanisters = this.scannedCanisters();
    const searchedDriverInventoryItems = this.#driverInventoryStore.items()
    return scannedCanisters.map((canisterId) => {
      console.log('canisterId', canisterId);
      console.log('searchedDriverInventoryItems', searchedDriverInventoryItems);
      return {
        scannedId: canisterId,
        ...searchedDriverInventoryItems.find((item) => {
          return item.inventoryItem.id === canisterId;
        }),
      };
    });
  });

  dispatch = input.required<IGetDispatchByIdQuery['dispatch']>();

  async confirmAssignment() {
    const dispatchId = this.dispatch()?.id;
    if (dispatchId) {
      await this.#dispatchStore.scanConfirm({
        dispatchId: dispatchId,
        scannedCanisters: this.scannedCanisters(),
        dispatchStatus: IDispatchStatus.InTransit,
      });
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
      if (scan.inventoryItem?.inventory?.catalogue) {
        const current =
          scannedQuantities.get(scan.inventoryItem.inventory.catalogue.id) || 0;
        scannedQuantities.set(
          scan.inventoryItem.inventory.catalogue.id,
          current + 1
        );
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

  isAllQuantitiesMatched = computed(() => {
    const summary = this.scanSummary();
    return summary.length > 0 && summary.every((item) => item.status === 'OK');
  });

  validateScans() {
    // this.#inventoryItemStore.setFilters([
    //   {
    //     field: 'id',
    //     value: '',
    //     values: this.scannerForm.get('canisters')?.value,
    //     operator: IQueryOperatorEnum.In,
    //   },
    // ]);
    this.#driverInventoryStore.setFilters([
      {
        field: 'inventoryItemId',
        value: '',
        values: this.scannerForm.get('canisters')?.value,
        operator: IQueryOperatorEnum.In,
      },
    ]);

    this.scannedCanisters.set(this.scannerForm.get('canisters')?.value ?? []);
  }

  async driverFromDepotConfirm() {
    if (!this.dispatch()) return;

    await this.#dispatchStore.scanConfirm({
      dispatchId: this.dispatch()?.id as string,
      scannedCanisters: this.scannedCanisters(),
      dispatchStatus: IDispatchStatus.DriverFromDepotConfirmed,
    });
  }
}
