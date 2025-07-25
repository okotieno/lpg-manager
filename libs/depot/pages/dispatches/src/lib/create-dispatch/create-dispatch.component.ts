import {
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonContent,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPopover,
  IonRow,
  IonSpinner,
  ViewDidEnter,
} from '@ionic/angular/standalone';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { IGetOrdersQuery, OrderStore } from '@lpg-manager/order-store';
import { Router } from '@angular/router';
import {
  IGetTransportersQuery,
  TransporterStore,
} from '@lpg-manager/transporter-store';
import { DriverStore, IGetDriversQuery } from '@lpg-manager/driver-store';
import { IGetVehiclesQuery, VehicleStore } from '@lpg-manager/vehicle-store';
import { DispatchStore, ICreateDispatchGQL } from '@lpg-manager/dispatch-store';
import { PaginatedResource } from '@lpg-manager/data-table';
import { CurrencyPipe } from '@angular/common';
import { IQueryOperatorEnum, ISelectCategory } from '@lpg-manager/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type IDriverItem = NonNullable<
  NonNullable<IGetDriversQuery['drivers']['items']>[number]
>;

type IVehicleItem = NonNullable<
  NonNullable<IGetVehiclesQuery['vehicles']['items']>[number]
>;

type ITransporterItem = NonNullable<
  NonNullable<IGetTransportersQuery['transporters']['items']>[number]
>;

type IOrderItem = NonNullable<
  NonNullable<IGetOrdersQuery['orders']['items']>[number]
>;

@Component({
  selector: 'lpg-create-dispatch',
  templateUrl: './create-dispatch.component.html',
  styleUrl: './create-dispatch.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SearchableSelectComponent,
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
    IonPopover,
    IonSpinner,
  ],
  providers: [
    TransporterStore,
    DriverStore,
    VehicleStore,
    OrderStore,
    DispatchStore,
  ],
})
export default class CreateDispatchComponent implements ViewDidEnter {
  itemsPopoverOpen = signal(false);
  itemsPopover = viewChild.required(IonPopover);
  activeOrder = signal<IOrderItem | undefined>(undefined);
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #dispatchStore = inject(DispatchStore);
  #orderStore = inject(OrderStore);

  transporterStore: PaginatedResource<ITransporterItem> =
    inject(TransporterStore);
  driverStore: PaginatedResource<IDriverItem> = inject(DriverStore);
  vehicleStore: PaginatedResource<IVehicleItem> = inject(VehicleStore);

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

  isLoading = this.#dispatchStore.isLoading;
  formSubmitted = false;

  isLoadingChangeEffect = effect(async () => {
    if (this.isLoading()) {
      this.dispatchForm.disable();
    } else if (this.formSubmitted) {
      await this.#router.navigate(['/dashboard', 'operations']);
    } else {
      this.dispatchForm.enable();
    }
  });

  // TODO: Filter from backend
  confirmedOrders = computed(() =>
    this.#orderStore.items().filter((order) => order.status === 'CONFIRMED')
  );

  constructor(private createDispatchGQL: ICreateDispatchGQL) {
    this.dispatchForm
      .get('transporter')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe({
        next: (value) => {
          this.dispatchForm.get('driver')?.enable();
          this.dispatchForm.get('driver')?.setValue(null);
          this.dispatchForm.get('vehicle')?.setValue(null);
          this.dispatchForm.get('vehicle')?.disable();
          this.driverStore.setFilters([
            {
              field: 'transporterId',
              operator: IQueryOperatorEnum.Equals,
              value: value?.id,
            },
          ]);
        },
      });

    this.dispatchForm
      .get('driver')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe({
        next: (value) => {
          this.dispatchForm.get('vehicle')?.enable();
          this.dispatchForm.get('vehicle')?.setValue(null);
          if (value?.id) {
            this.vehicleStore.setFilters([
              {
                field: 'driverId',
                operator: IQueryOperatorEnum.Equals,
                value: value.id,
              },
            ]);
          }
        },
      });
  }

  ionViewDidEnter(): void {
    this.formSubmitted = false;
    this.dispatchForm.enable();
    this.dispatchForm.reset();
  }

  presentPopover($event: Event, order: IOrderItem) {
    this.activeOrder.set(order);
    $event.preventDefault();
    const itemsPopover = this.itemsPopover();
    itemsPopover.event = $event;
    this.itemsPopoverOpen.set(true);
  }

  onOrderSelect(event: any, order: any) {
    if (event.detail.checked) {
      this.selectedOrders.push(order.id);
    } else {
      this.selectedOrders = this.selectedOrders.filter((id) => id !== order.id);
    }
  }

  driverValueLabelFormatter = (item: IDriverItem) =>
    `${item.user.firstName} ${item.user.lastName}`;

  vehicleValueLabelFormatter = (item: IVehicleItem) =>
    `${item.registrationNumber}`;

  async createDispatch() {
    const formValue = this.dispatchForm.value;
    this.formSubmitted = true;
    this.#dispatchStore.createNewItem({
      params: {
        transporterId: formValue.transporter?.id as string,
        driverId: formValue.driver?.id as string,
        vehicleId: formValue.vehicle?.id as string,
        orderIds: this.selectedOrders,
        dispatchDate: new Date().toISOString(),
      },
    });
  }
}
