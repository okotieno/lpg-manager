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
  IonRow, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';

interface IDriverData {
  vehicles: string[];
  id: string;
  name: string;
  licenseNumber: string;
  contactNumber: string;
  email: string;
}
interface IVehicleData {
  id: string;
  registrationNumber: string;
  capacity: number;
  type: string;
}

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
    IonSelect,
    IonSelectOption,
  ],
  templateUrl: 'driver-dialog.component.html',
})
export class DriverDialogComponent {
  #modalCtrl = inject(ModalController);
  #fb = inject(FormBuilder);

  driver = input<IDriverData>();
  vehicles = input<IVehicleData[]>([]);
  isEditing = computed(() => !!this.driver()?.id);

  driverForm = this.#fb.group({
    id: [crypto.randomUUID() as string],
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
    vehicles: [[] as string[], Validators.required],
  });
  driverChangedEffect = effect(() => {
    const driver = this.driver();
    untracked(() => {
      if (driver) {
        this.driverForm.patchValue({
          id: driver.id,
          name: driver.name,
          licenseNumber: driver.licenseNumber,
          contactNumber: driver.contactNumber,
          email: driver.email,
          vehicles: driver.vehicles,
        });
      }
    });
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
