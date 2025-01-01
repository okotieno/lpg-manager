import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  ModalController,
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
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Vehicle</ion-title>
        <ion-buttons slot="end">
          <ion-button color="danger" fill="clear" shape="round" (click)="dismiss()">
            <ion-icon slot="icon-only" name="circle-xmark"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()">
        <ion-item lines="none">
          <ion-input
            label="Registration Number"
            labelPlacement="stacked"
            formControlName="registrationNumber"
            placeholder="Enter registration number"
            errorText="Registration number is required"
          ></ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-input
            type="number"
            label="Capacity"
            labelPlacement="stacked"
            formControlName="capacity"
            placeholder="Enter capacity"
            errorText="Capacity is required"
          ></ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-input
            label="Vehicle Type"
            labelPlacement="stacked"
            formControlName="type"
            placeholder="Enter vehicle type"
            errorText="Vehicle type is required"
          ></ion-input>
        </ion-item>

        <ion-button
          type="submit"
          expand="block"
          class="ion-margin-top"
          [disabled]="!vehicleForm.valid"
        >
          Add Vehicle
        </ion-button>
      </form>
    </ion-content>
  `,
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
