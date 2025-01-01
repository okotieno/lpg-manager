import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonIcon,
  IonInput,
  IonItem,
  IonRow,
  ModalController,
  AlertController,
} from '@ionic/angular/standalone';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ITransporterModel } from '@lpg-manager/types';
import {
  GetTransportersDocument,
  ICreateTransporterGQL,
  IUpdateTransporterGQL,
} from '@lpg-manager/transporter-store';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';
import { defaultQueryParams } from '@lpg-manager/data-table';
import { IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';
import { VehicleDialogComponent } from '../vehicle-dialog/vehicle-dialog.component';
import { DriverDialogComponent } from '../driver-dialog/driver-dialog.component';

@Component({
  selector: 'lpg-transporter-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonButton,
    IonRow,
    IonCol,
    IonIcon,
    RouterLink
  ],
  templateUrl: './transporters-form.component.html',
  styleUrl: './transporters-form.component.scss',
  providers: [],
})
export default class TransportersFormComponent implements IHasUnsavedChanges {
  #fb = inject(FormBuilder);
  #createTransporterGQL = inject(ICreateTransporterGQL);
  #updateTransporterGQL = inject(IUpdateTransporterGQL);
  #modalCtrl = inject(ModalController);
  #alertCtrl = inject(AlertController);

  transporterForm = this.#fb.group({
    name: ['', [Validators.required]],
    contactPerson: ['', [Validators.required]],
    contactNumber: ['', [Validators.required]],
    drivers: this.#fb.array([]),
    vehicles: this.#fb.array([]),
  });
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  transporter = input<ITransporterModel>();
  isEditing = computed(() => !!this.transporter());
  roleId = computed(() => this.transporter()?.id);
  drivers = signal<
    {
      id: string;
      name: string;
      licenseNumber: string;
      contactNumber: string;
    }[]
  >([]);
  vehicles = signal<
    {
      id: string;
      registrationNumber: string;
      capacity: number | null;
      type: string;
    }[]
  >([]);
  transporterChangeEffect = effect(() => {
    const transporter = this.transporter();
    const drivers =
      transporter?.drivers?.map((brand) => ({
        id: brand?.id as string,
      })) ?? [];
    untracked(() => {
      if (transporter) {
        this.transporterForm.patchValue({
          name: transporter.name,
          drivers,
        });
      }
    });
  });

  get driverInput() {
    return this.transporterForm.get('drivers') as FormArray;
  }

  get vehicleInput() {
    return this.transporterForm.get('vehicles') as FormArray;
  }

  get hasUnsavedChanges() {
    return this.transporterForm.dirty;
  }

  async addDriver() {
    const modal = await this.#modalCtrl.create({
      component: DriverDialogComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      const driverForm = this.#fb.nonNullable.group({
        id: [data.id],
        name: [data.name],
        licenseNumber: [data.licenseNumber],
        contactNumber: [data.contactNumber],
      });

      this.driverInput.push(driverForm);
      this.drivers.update((drivers) => [
        ...drivers,
        driverForm.value as Required<typeof driverForm.value>,
      ]);
    }
  }

  async removeDriver(index: number) {
    const alert = await this.#alertCtrl.create({
      header: 'Confirm Removal',
      message: 'Are you sure you want to remove this driver?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Remove',
          role: 'confirm',
          handler: () => {
            this.driverInput.removeAt(index);
            this.drivers.update((drivers) => {
              drivers.splice(index, 1);
              return [...drivers];
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async addVehicle() {
    const modal = await this.#modalCtrl.create({
      component: VehicleDialogComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      const vehicleForm = this.#fb.group({
        id: [data.id],
        registrationNumber: [data.registrationNumber],
        capacity: [data.capacity],
        type: [data.type],
      });

      this.vehicleInput.push(vehicleForm);
      this.vehicles.update((vehicles) => [
        ...vehicles,
        vehicleForm.value as Required<typeof vehicleForm.value>,
      ]);
    }
  }

  async removeVehicle(index: number) {
    const alert = await this.#alertCtrl.create({
      header: 'Confirm Removal',
      message: 'Are you sure you want to remove this vehicle?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Remove',
          role: 'confirm',
          handler: () => {
            this.vehicleInput.removeAt(index);
            this.vehicles.update((vehicles) => {
              vehicles.splice(index, 1);
              return [...vehicles];
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async onSubmit() {
    this.transporterForm.updateValueAndValidity();
    if (this.transporterForm.valid) {
      const { name, drivers, contactNumber, contactPerson } =
        this.transporterForm.value;
      const params = {
        name: name as string,
        contactNumber: contactNumber as string,
        contactPerson: contactPerson as string,
        // drivers: drivers?.map((brand) => ({ id: brand?.id as string })) ?? [],
      };

      if (this.isEditing() && this.roleId()) {
        this.#updateTransporterGQL
          .mutate(
            {
              id: this.roleId() as string,
              params,
            },
            {
              context: {
                [SHOW_ERROR_MESSAGE]: true,
                [SHOW_SUCCESS_MESSAGE]: true,
              },
              awaitRefetchQueries: true,
              refetchQueries: [
                {
                  query: GetTransportersDocument,
                  variables: {},
                },
              ],
            }
          )
          .subscribe({
            next: async () => {
              this.transporterForm.reset();
              await this.#router.navigate(['../../'], {
                relativeTo: this.#route,
              });
            },
          });
      } else {
        this.#createTransporterGQL
          .mutate(
            {
              params,
            },
            {
              context: {
                [SHOW_ERROR_MESSAGE]: true,
                [SHOW_SUCCESS_MESSAGE]: true,
              },

              awaitRefetchQueries: true,
              refetchQueries: [
                {
                  query: GetTransportersDocument,
                  variables: defaultQueryParams,
                },
              ],
            }
          )
          .subscribe({
            next: async () => {
              this.transporterForm.reset();
              await this.#router.navigate(['../'], { relativeTo: this.#route });
            },
          });
      }
    }
  }
}
