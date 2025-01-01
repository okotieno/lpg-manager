import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent, IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem, IonRow,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';

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

  vehicleForm = this.#fb.group({
    id: [crypto.randomUUID()],
    registrationNumber: ['', Validators.required],
    capacity: [null as null | number, [Validators.required, Validators.min(0)]],
    type: ['', Validators.required],
  });

  async dismiss() {
    await this.#modalCtrl.dismiss(null, 'cancel');
  }

  async onSubmit() {
    if (this.vehicleForm.valid) {
      await this.#modalCtrl.dismiss(this.vehicleForm.value, 'confirm');
    }
  }
}
