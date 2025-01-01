import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonRow,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

interface IVehicleData {
  id: string;
  registrationNumber: string;
  capacity: number;
  type: string;
}

@Component({
  selector: 'lpg-vehicle-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonInput,
    IonFooter,
    IonRow,
  ],
  templateUrl: 'vehicle-dialog.component.html',
})
export class VehicleDialogComponent {
  #modalCtrl = inject(ModalController);
  #fb = inject(FormBuilder);

  vehicle = input<IVehicleData>();
  isEditing = computed(() => !!this.vehicle()?.id)

  vehicleForm = this.#fb.group({
    id: [crypto.randomUUID() as string],
    registrationNumber: ['', Validators.required],
    capacity: [null as null | number, [Validators.required, Validators.min(0)]],
    type: ['', Validators.required],
  });

  vehicleChangedEffect = effect(() => {
    const vehicle = this.vehicle();
    untracked(() => {
      if (vehicle) {
        this.vehicleForm.patchValue({
          id: vehicle.id,
          registrationNumber: vehicle.registrationNumber,
          capacity: vehicle.capacity,
          type: vehicle.type,
        });
      }
    });
  });

  constructor() {
    if (this.vehicle()) {
    } else {
      this.vehicleForm.patchValue({
        id: crypto.randomUUID(),
      });
    }
  }

  async dismiss() {
    await this.#modalCtrl.dismiss(null, 'cancel');
  }

  async onSubmit() {
    if (this.vehicleForm.valid) {
      await this.#modalCtrl.dismiss(this.vehicleForm.value, 'confirm');
    }
  }
}
