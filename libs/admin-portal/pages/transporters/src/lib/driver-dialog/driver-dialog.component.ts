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
  templateUrl: 'driver-dialog.component.html',
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
    email: ['', [Validators.required, Validators.email]],
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
