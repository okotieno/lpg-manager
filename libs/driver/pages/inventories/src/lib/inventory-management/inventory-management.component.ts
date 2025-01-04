import { Component, inject, input } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ICreateInventoryGQL,
  InventoryStore,
} from '@lpg-manager/inventory-store';
import {
  CatalogueStore,
  IGetCataloguesQuery,
} from '@lpg-manager/catalogue-store';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { AuthStore } from '@lpg-manager/auth-store';
import {
  IQueryOperatorEnum,
  IQueryParamsFilter,
  ISelectCategory,
} from '@lpg-manager/types';
import { PaginatedResource } from '@lpg-manager/data-table';

@Component({
  selector: 'lpg-inventory-management',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonButtons,
    IonIcon,
    ReactiveFormsModule,
    SearchableSelectComponent,
  ],
  templateUrl: './inventory-management.component.html',
  providers: [InventoryStore, CatalogueStore],
})
export default class InventoryManagementComponent {
  #fb = inject(FormBuilder);
  #inventoryStore = inject(InventoryStore);
  #modalCtrl = inject(ModalController);
  #authStore = inject(AuthStore);
  #createInventoryGQL = inject(ICreateInventoryGQL);
  cataloguesStore = inject(CatalogueStore) as PaginatedResource<
    NonNullable<NonNullable<IGetCataloguesQuery['catalogues']['items']>[number]>
  >;

  mode = input<'create' | 'edit'>('create');
  defaultFilters = input<IQueryParamsFilter[]>([]);
  activeStation = this.#authStore.activeStation;

  inventoryForm = this.#fb.group({
    catalogue: [null as null | ISelectCategory, Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
    reason: ['', Validators.required],
    batchNumber: ['', Validators.required],
  });

  constructor() {
    const activeStationId = this.activeStation()?.id;
    if (activeStationId) {
      this.cataloguesStore.setFilters([
        {
          field: 'driverId',
          operator: IQueryOperatorEnum.Equals,
          value: activeStationId,
          values: [],
        },
      ]);
    }
  }

  async dismiss() {
    await this.#modalCtrl.dismiss(null, 'cancel');
  }

  async save() {
    if (this.inventoryForm.valid) {
      const formValue = this.inventoryForm.value;
      this.#createInventoryGQL
        .mutate({
          params: {
            catalogueId: formValue.catalogue?.id as string,
            stationId: this.activeStation()?.id as string,
            quantity: formValue.quantity as number,
            batchNumber: formValue.batchNumber as string,
          },
        })
        .subscribe({
          next: (result) => {
            if (result?.data) {
              this.#modalCtrl.dismiss(result.data, 'confirm');
            }
          },
        });
    }
  }
}
