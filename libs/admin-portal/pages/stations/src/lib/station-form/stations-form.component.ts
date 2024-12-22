import {
  Component,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonInput,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PermissionsStore } from '@lpg-manager/permission-store';
import { IStationModel, IStationType } from '@lpg-manager/types';
import {
  GetStationsDocument,
  ICreateStationGQL,
  IUpdateStationGQL,
} from '@lpg-manager/station-store';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';
import { defaultQueryParams } from '@lpg-manager/data-table';

@Component({
  selector: 'lpg-station-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonButton,
    RouterLink,
    IonSelect,
    IonSelectOption,
    IonRow,
    IonCol,
  ],
  templateUrl: './stations-form.component.html',
  providers: [PermissionsStore],
})
export default class StationsFormComponent {
  #fb = inject(FormBuilder);
  #createStationGQL = inject(ICreateStationGQL);
  #updateStationGQL = inject(IUpdateStationGQL);
  stationForm = this.#fb.group({
    name: ['', [Validators.required]],
    type: ['DEPOT' as null | IStationType, [Validators.required]],
  });
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  station = input<IStationModel>();
  isEditing = computed(() => !!this.station());
  roleId = computed(() => this.station()?.id);
  brandChangeEffect = effect(() => {
    const station = this.station();
    untracked(() => {
      if (station) {
        this.stationForm.patchValue({
          name: station.name,
          type: station.type,
        });
      }
    });
  });

  async onSubmit() {
    this.stationForm.updateValueAndValidity();
    if (this.stationForm.valid) {
      const { name, type } = this.stationForm.value;

      if (this.isEditing() && this.roleId()) {
        this.#updateStationGQL
          .mutate(
            {
              id: this.roleId() as string,
              params: {
                name: name as string,
                type: type as IStationType,
              },
            },
            {
              context: {
                [SHOW_ERROR_MESSAGE]: true,
                [SHOW_SUCCESS_MESSAGE]: true,
              },
              awaitRefetchQueries: true,
              refetchQueries: [
                {
                  query: GetStationsDocument,
                  variables: {},
                },
              ],
            }
          )
          .subscribe({
            next: async () => {
              await this.#router.navigate(['../../'], {
                relativeTo: this.#route,
              });
            },
          });
      } else {
        this.#createStationGQL
          .mutate(
            {
              params: {
                name: name as string,
                type: type as IStationType,
              },
            },
            {
              context: {
                [SHOW_ERROR_MESSAGE]: true,
                [SHOW_SUCCESS_MESSAGE]: true,
              },

              awaitRefetchQueries: true,
              refetchQueries: [
                {
                  query: GetStationsDocument,
                  variables: defaultQueryParams
                },
              ],
            }
          )
          .subscribe({
            next: async () => {
              await this.#router.navigate(['../'], { relativeTo: this.#route });
            },
          });
      }
    }
  }
}
