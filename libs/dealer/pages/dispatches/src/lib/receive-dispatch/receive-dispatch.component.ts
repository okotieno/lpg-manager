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
  ],
  templateUrl: './receive-dispatch.component.html',
  styleUrl: './receive-dispatch.component.scss',
  providers: [DispatchStore, InventoryItemStore],
})
export default class ReceiveDispatchComponent {
  #route = inject(ActivatedRoute);
  #inventoryItemStore = inject(InventoryItemStore);
  searchedInventoryItem = this.#inventoryItemStore.searchedItemsEntities;
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #dispatchStore = inject(DispatchStore);
  scannerForm = this.#fb.group({ canisters: [[] as string[]] });

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
    dispatch.consolidatedOrders.map(o => o.orders).flat().forEach((order) => {
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
      const catalogue = dispatch.consolidatedOrders.map(o => o.orders).flat()
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

  async dealerToDriverConfirm() {
    if (!this.dispatch()) return;

    // await this.#dispatchStore.scanConfirm({
    //   dispatchId: this.dispatch()?.id as string,
    //   scannedCanisters: this.scannedCanisters(),
    //   dispatchStatus: IDispatchStatus.DealerFromDriverConfirmed,
    // });
  }
}
