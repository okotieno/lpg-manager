import { Component, inject, input } from '@angular/core';
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
  IonItemDivider,
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
  ],
  template: `
    <ion-content class="ion-padding">
      @if (dispatch(); as dispatch) {
      <ion-list>
        <ion-item>
          <ion-label>
            <h2>Driver</h2>
            <p>
              {{ dispatch.driver.user.firstName }}
              {{ dispatch.driver.user.lastName }}
            </p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h2>Vehicle</h2>
            <p>{{ dispatch.vehicle.registrationNumber }}</p>
          </ion-label>
        </ion-item>

        <ion-item-divider>
          <ion-label>Orders to Transfer</ion-label>
        </ion-item-divider>

        @for (order of dispatch.orders; track order.id) {
        <ion-item>
          <ion-label>
            <h3>Order #{{ order.id }}</h3>
            <!--                <p>{{ order.dealer.name }}</p>-->
            <!--                <p>Total Items: {{ order.items.length }}</p>-->
          </ion-label>
          <ion-badge slot="end" color="success">Ready</ion-badge>
        </ion-item>
        }
      </ion-list>
      }
    </ion-content>

    <ion-footer class="ion-padding">
      <ion-buttons class="ion-justify-content-end">
        <ion-button shape="round" fill="outline" color="primary" (click)="validateScans()">Validate scan </ion-button>
        <form [formGroup]="scannerForm">
          {{ searchedInventoryItem() | json}}
          <lpg-scanner-input formControlName="canisters" />
        </form>
      </ion-buttons>
    </ion-footer>
  `,
  providers: [DispatchStore, InventoryItemStore],
})
export default class AssignLoadComponent {
  #route = inject(ActivatedRoute);
  #inventoryItemStore = inject(InventoryItemStore);
  searchedInventoryItem = this.#inventoryItemStore.searchedItemsEntities
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

  dispatch = input.required<IGetDispatchByIdQuery['dispatch']>();

  async confirmAssignment() {
    const dispatchId = this.dispatch()?.id;
    if (dispatchId) {

      // await this.#dispatchStore.updateDispatchStatus(dispatchId, 'IN_TRANSIT');
      // await this.#router.navigate(['../'], { relativeTo: this.#route });
    }
  }

  validateScans() {
    this.#inventoryItemStore.setFilters([
      {
        field: 'id',
        value: '',
        values: this.scannerForm.get('canisters')?.value,
        operator: IQueryOperatorEnum.In,
      },
    ])
  }
}
