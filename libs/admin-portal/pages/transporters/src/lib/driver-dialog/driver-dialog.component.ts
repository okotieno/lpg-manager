import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'lpg-driver-dialog',
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
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Driver</ion-title>
        <ion-buttons slot="end">
          <ion-button
            color="danger"
            fill="clear"
            shape="round"
            (click)="dismiss()"
          >
            <ion-icon slot="icon-only" name="circle-xmark"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="driverForm" (ngSubmit)="onSubmit()" id="driver-form">
        <ion-item lines="none">
          <ion-input
            label="Driver Name"
            labelPlacement="stacked"
            formControlName="name"
            placeholder="Enter driver name"
            [errorText]="nameErrorText"
            helperText="format: firstname lastname"
          ></ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-input
            label="License Number"
            labelPlacement="stacked"
            formControlName="licenseNumber"
            placeholder="Enter license number"
            errorText="License number is required"
          ></ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-input
            label="Contact Number"
            labelPlacement="stacked"
            formControlName="contactNumber"
            placeholder="Enter contact number"
            errorText="Contact number is required"
          ></ion-input>
        </ion-item>
      </form>
    </ion-content>
    <ion-footer>
      <ion-row class="ion-padding ion-justify-content-end">
        <ion-button
          form="driver-form"
          type="submit"
          expand="block"
          class="ion-margin-top"
          [disabled]="!driverForm.valid"
        >
          Add Driver
        </ion-button>
      </ion-row>
    </ion-footer>
  `,
})
export class DriverDialogComponent {
  #modalCtrl = inject(ModalController);
  #fb = inject(FormBuilder);

  driverForm = this.#fb.group({
    id: [crypto.randomUUID()],
    name: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)+$/),
      ],
    ],
    licenseNumber: ['', Validators.required],
    contactNumber: ['', Validators.required],
  });

  get nameErrorText() {
    if (this.driverForm.get('name')?.hasError('pattern'))
      return 'Please provide first name and last name.';
    return 'Driver name is required';
  }

  async dismiss() {
    await this.#modalCtrl.dismiss(null, 'cancel');
  }

  async onSubmit() {
    if (this.driverForm.valid) {
      await this.#modalCtrl.dismiss(this.driverForm.value, 'confirm');
    }
  }
}
