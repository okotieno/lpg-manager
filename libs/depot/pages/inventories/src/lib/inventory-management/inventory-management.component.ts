import {
  Component,
  computed,
  effect,
  inject,
  input,
  ResourceRef,
  untracked,
} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonRow,
  IonSpinner,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ICreateInventoryMutation,
  InventoryStore,
} from '@lpg-manager/inventory-store';
import {
  CatalogueStore,
  IGetCataloguesQuery,
} from '@lpg-manager/catalogue-store';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { AuthStore } from '@lpg-manager/auth-store';
import { IQueryOperatorEnum, ISelectCategory } from '@lpg-manager/types';
import { PaginatedResource } from '@lpg-manager/data-table';
import { MutationResult } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lpg-inventory-management',
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    ReactiveFormsModule,
    SearchableSelectComponent,
    IonSpinner,
    IonGrid,
    IonCol,
    IonRow,
  ],
  templateUrl: './inventory-management.component.html',
  providers: [InventoryStore, CatalogueStore],
})
export default class InventoryManagementComponent implements ViewWillEnter {
  formSubmitted = false;
  #fb = inject(FormBuilder);
  #inventoryStore = inject(InventoryStore);
  #authStore = inject(AuthStore);
  activeStation = this.#authStore.activeStation;
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  stationFilter = computed(() => {
    if (this.activeStation()?.id)
      return {
        operator: IQueryOperatorEnum.Equals,
        value: this.activeStation()?.id,
        field: 'stationId',
        values: [],
      };
    return;
  });
  depotFilters = computed(() => [
    { ...this.stationFilter(), field: 'depotId' },
  ]);
  isLoading = this.#inventoryStore.isLoading;
  formSubmittedEffect = effect(async () => {
    const isLoading = this.isLoading();
    await untracked(async () => {
      if (this.formSubmitted && !isLoading)
        await this.#router.navigate(
          [
            '../changes',
            this.createdItemResource.value()?.data?.createInventory?.data.id,
          ],
          { relativeTo: this.#route }
        );
    });
  });
  cataloguesStore = inject(CatalogueStore) as PaginatedResource<
    NonNullable<NonNullable<IGetCataloguesQuery['catalogues']['items']>[number]>
  >;

  mode = input<'create' | 'edit'>('create');
  // depotFilters = input<IQueryParamsFilter[]>([]);

  inventoryForm = this.#fb.group({
    catalogue: [null as null | ISelectCategory, Validators.required],
    quantity: [null as null | number, [Validators.required, Validators.min(0)]],
    reason: ['', Validators.required],
    batchNumber: ['', Validators.required],
  });
  private createdItemResource!: ResourceRef<
    MutationResult<ICreateInventoryMutation>
  >;

  constructor() {
    const activeStationId = this.activeStation()?.id;
    if (activeStationId) {
      this.cataloguesStore.setFilters([
        {
          field: 'depotId',
          operator: IQueryOperatorEnum.Equals,
          value: activeStationId,
          values: [],
        },
      ]);
    }
  }

  ionViewWillEnter(): void {
    this.formSubmitted = false;
  }

  async save() {
    if (this.inventoryForm.valid) {
      const formValue = this.inventoryForm.value;
      this.formSubmitted = true;
      this.createdItemResource = this.#inventoryStore.createNewItem(
        {
          params: {
            catalogueId: formValue.catalogue?.id as string,
            stationId: this.activeStation()?.id as string,
            quantity: formValue.quantity as number,
            reason: formValue.reason,
            batchNumber: formValue.batchNumber as string,
          },
        },
        { filters: [this.stationFilter()] }
      );
    }
  }
}
