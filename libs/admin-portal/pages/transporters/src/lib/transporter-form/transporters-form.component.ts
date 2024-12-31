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
  ITransporterModel,
} from '@lpg-manager/types';
import {
  GetTransportersDocument,
  ICreateTransporterGQL,
  IUpdateTransporterGQL,
} from '@lpg-manager/transporter-store';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';
import { defaultQueryParams, PaginatedResource } from '@lpg-manager/data-table';
import { IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';

@Component({
  selector: 'lpg-transporter-form',
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
  templateUrl: './transporters-form.component.html',
  providers: [BrandStore],
})
export default class TransportersFormComponent implements IHasUnsavedChanges {
  #fb = inject(FormBuilder);
  #createTransporterGQL = inject(ICreateTransporterGQL);
  #updateTransporterGQL = inject(IUpdateTransporterGQL);
  brandStore = inject(BrandStore) as PaginatedResource<
    NonNullable<NonNullable<IGetBrandsQuery['brands']['items']>[number]>
  >;
  transporterForm = this.#fb.group({
    name: ['', [Validators.required]],
    drivers: [[] as ISelectCategory[]],
  });
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  transporter = input<ITransporterModel>();
  isEditing = computed(() => !!this.transporter());
  roleId = computed(() => this.transporter()?.id);
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

  showBrandsField = signal(false);

  get hasUnsavedChanges() {
    return this.transporterForm.dirty;
  }

  async onSubmit() {
    this.transporterForm.updateValueAndValidity();
    if (this.transporterForm.valid) {
      const { name, drivers } = this.transporterForm.value;
      const params = {
        name: name as string,
        brands: drivers?.map((brand) => ({ id: brand?.id as string })) ?? [],
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
