import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonCheckbox,
  IonItemDivider, IonRow, IonCol
} from '@ionic/angular/standalone';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { OrderStore } from '@lpg-manager/order-store';
import { Router } from '@angular/router';
import {
  TransporterStore,
  IGetTransportersQuery,
} from '@lpg-manager/transporter-store';
import { DriverStore, IGetDriversQuery } from '@lpg-manager/driver-store';
import { IGetVehiclesQuery, VehicleStore } from '@lpg-manager/vehicle-store';
import { DispatchStore } from '@lpg-manager/dispatch-store';
import { PaginatedResource } from '@lpg-manager/data-table';
import { CurrencyPipe } from '@angular/common';
import { IQueryOperatorEnum, ISelectCategory } from '@lpg-manager/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'lpg-create-dispatch',
  templateUrl: './create-dispatch.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SearchableSelectComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonList,
    IonCheckbox,
    IonItemDivider,
    CurrencyPipe,
    IonRow,
    IonCol,
  ],
  providers: [
    TransporterStore,
    DriverStore,
    VehicleStore,
    OrderStore,
    DispatchStore,
  ],
})
export default class CreateDispatchComponent {
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #dispatchStore = inject(DispatchStore);
  #orderStore = inject(OrderStore);

  transporterStore: PaginatedResource<
    NonNullable<
      NonNullable<IGetTransportersQuery['transporters']['items']>[number]
    >
  > = inject(TransporterStore);
  driverStore: PaginatedResource<
    NonNullable<NonNullable<IGetDriversQuery['drivers']['items']>[number]>
  > = inject(DriverStore);
  vehicleStore: PaginatedResource<
    NonNullable<NonNullable<IGetVehiclesQuery['vehicles']['items']>[number]>
  > = inject(VehicleStore);

  selectedOrders: string[] = [];

  dispatchForm = this.#fb.group({
    transporter: [null as null | ISelectCategory, Validators.required],
    driver: [
      { value: null as null | ISelectCategory, disabled: true },
      Validators.required,
    ],
    vehicle: [
      { value: null as null | ISelectCategory, disabled: true },
      Validators.required,
    ],
  });

  confirmedOrders = computed(() =>
    this.#orderStore.items().filter((order) => order.status === 'CONFIRMED')
  );

  constructor() {
    // Update available drivers and vehicles when transporter changes
    effect(() => {
      const transporter = this.dispatchForm.get('transporter')?.value;
      if (transporter) {
        this.driverStore.setFilters([
          {
            field: 'transporterId',
            operator: IQueryOperatorEnum.Equals,
            value: transporter.id,
          },
        ]);
        this.vehicleStore.setFilters([
          {
            field: 'transporterId',
            operator: IQueryOperatorEnum.Equals,
            value: transporter.id,
          },
        ]);
      }
    });

    this.dispatchForm
      .get('transporter')
      ?.valueChanges.pipe(
        tap(() => {
          this.dispatchForm.get('driver')?.enable();
          this.dispatchForm.get('vehicle')?.setValue(null);
          this.dispatchForm.get('vehicle')?.disable();
          this.dispatchForm.get('driver')?.setValue(null);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.dispatchForm
      .get('driver')
      ?.valueChanges.pipe(
        tap(() => {
          this.dispatchForm.get('vehicle')?.enable();
          this.dispatchForm.get('vehicle')?.setValue(null);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  onOrderSelect(event: any, order: any) {
    if (event.detail.checked) {
      this.selectedOrders.push(order.id);
    } else {
      this.selectedOrders = this.selectedOrders.filter((id) => id !== order.id);
    }
  }

  async createDispatch() {
    if (this.dispatchForm.valid && this.selectedOrders.length > 0) {
      const formValue = this.dispatchForm.value;
      this.#dispatchStore.createNewItem({
        transporterId: formValue.transporter?.id,
        driverId: formValue.driver?.id,
        vehicleId: formValue.vehicle?.id,
        orderIds: this.selectedOrders,
        dispatchDate: new Date(),
      });
      await this.#router.navigate(['/operations']);
    }
  }
}
