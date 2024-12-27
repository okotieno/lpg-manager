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
  IonInput,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { BrandStore, IGetBrandsQuery } from '@lpg-manager/brand-store';
import {
  ISelectCategory,
  IStationModel,
  IStationType,
} from '@lpg-manager/types';
import {
  GetStationsDocument,
  ICreateStationGQL,
  IUpdateStationGQL,
} from '@lpg-manager/station-store';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';
import { defaultQueryParams, PaginatedResource } from '@lpg-manager/data-table';
import { IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';

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
    SearchableSelectComponent,
  ],
  templateUrl: './stations-form.component.html',
  providers: [BrandStore],
})
export default class StationsFormComponent implements IHasUnsavedChanges {
  #fb = inject(FormBuilder);
  #createStationGQL = inject(ICreateStationGQL);
  #updateStationGQL = inject(IUpdateStationGQL);
  brandStore = inject(BrandStore) as PaginatedResource<
    NonNullable<NonNullable<IGetBrandsQuery['brands']['items']>[number]>
  >;
  stationForm = this.#fb.group({
    name: ['', [Validators.required]],
    type: ['DEALER' as null | IStationType, [Validators.required]],
    brands: [[] as ISelectCategory[]],
  });
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  station = input<IStationModel>();
  isEditing = computed(() => !!this.station());
  roleId = computed(() => this.station()?.id);
  stationChangeEffect = effect(() => {
    const station = this.station();
    const brands =
      station?.brands?.map((brand) => ({
        id: brand?.id as string,
      })) ?? [];
    untracked(() => {
      if (station) {
        this.stationForm.patchValue({
          name: station.name,
          type: station.type,
          brands,
        });
      }
    });
  });

  showBrandsField = signal(false);

  constructor() {
    this.stationForm.get('type')?.valueChanges.subscribe((value) => {
      const brandsControl = this.stationForm.get('brands');
      if (value === 'DEPOT') {
        brandsControl?.setValidators([Validators.required]);
        this.showBrandsField.set(true);
      } else {
        brandsControl?.clearValidators();
        brandsControl?.setValue([]);
        this.showBrandsField.set(false);
      }
      brandsControl?.updateValueAndValidity();
    });
  }

  get hasUnsavedChanges() {
    return this.stationForm.dirty;
  }

  async onSubmit() {
    this.stationForm.updateValueAndValidity();
    if (this.stationForm.valid) {
      const { name, type, brands } = this.stationForm.value;
      const params = {
        name: name as string,
        type: type as IStationType,
        brands: brands?.map((brand) => ({ id: brand?.id as string })) ?? [],
      };

      if (this.isEditing() && this.roleId()) {
        this.#updateStationGQL
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
                  query: GetStationsDocument,
                  variables: {},
                },
              ],
            }
          )
          .subscribe({
            next: async () => {
              this.stationForm.reset();
              await this.#router.navigate(['../../'], {
                relativeTo: this.#route,
              });
            },
          });
      } else {
        this.#createStationGQL
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
                  query: GetStationsDocument,
                  variables: defaultQueryParams,
                },
              ],
            }
          )
          .subscribe({
            next: async () => {
              this.stationForm.reset();
              await this.#router.navigate(['../'], { relativeTo: this.#route });
            },
          });
      }
    }
  }
}
