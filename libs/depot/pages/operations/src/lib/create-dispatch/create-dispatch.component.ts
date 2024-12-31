import { Component, inject } from '@angular/core';
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
  IonItemDivider,
} from '@ionic/angular/standalone';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { TransporterStore } from '../stores/transporter.store';
import { DriverStore } from '../stores/driver.store';
import { VehicleStore } from '../stores/vehicle.store';
import { OrderStore } from '@lpg-manager/order-store';
import { Router } from '@angular/router';
import { DispatchStore } from '../stores/dispatch.store';

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
  ],
  providers: [TransporterStore, DriverStore, VehicleStore, OrderStore, DispatchStore],
})
export default class CreateDispatchComponent {
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #dispatchStore = inject(DispatchStore);
  #orderStore = inject(OrderStore);

  transporterStore = inject(TransporterStore);
  driverStore = inject(DriverStore);
  vehicleStore = inject(VehicleStore);

  selectedOrders: string[] = [];

  dispatchForm = this.#fb.group({
    transporter: [null, Validators.required],
    driver: [null, Validators.required],
    vehicle: [null, Validators.required],
  });

  confirmedOrders = computed(() => 
    this.#orderStore.items().filter(order => order.status === 'CONFIRMED')
  );

  constructor() {
    // Update available drivers and vehicles when transporter changes
    effect(() => {
      const transporter = this.dispatchForm.get('transporter')?.value;
      if (transporter) {
        this.driverStore.setFilters([
          { field: 'transporterId', operator: 'equals', value: transporter.id }
        ]);
        this.vehicleStore.setFilters([
          { field: 'transporterId', operator: 'equals', value: transporter.id }
        ]);
      }
    });
  }

  onOrderSelect(event: any, order: any) {
    if (event.detail.checked) {
      this.selectedOrders.push(order.id);
    } else {
      this.selectedOrders = this.selectedOrders.filter(id => id !== order.id);
    }
  }

  async createDispatch() {
    if (this.dispatchForm.valid && this.selectedOrders.length > 0) {
      const formValue = this.dispatchForm.value;
      await this.#dispatchStore.createDispatch({
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