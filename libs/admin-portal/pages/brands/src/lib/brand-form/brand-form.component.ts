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
  AlertController,
  IonButton,
  IonButtons,
  IonCol,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader, IonRow,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ICreateBrandGQL, IUpdateBrandGQL } from '@lpg-manager/brand-store';
import {
  IBrandModel,
  ISelectCategory,
  IUpdateBrandCatalogueInput,
} from '@lpg-manager/types';
import { FileUploadComponent } from '@lpg-manager/file-upload-component';
import { ModalController } from '@ionic/angular/standalone';
import { BrandItemModalComponent } from './brand-item-modal/brand-item-modal.component';
import { NgTemplateOutlet } from '@angular/common';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';
import { IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';
import { PermissionStore } from '@lpg-manager/permission-store';

@Component({
  selector: 'lpg-brand-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonButton,
    RouterLink,
    FileUploadComponent,
    FileUploadComponent,
    IonList,
    IonListHeader,
    IonLabel,
    IonIcon,
    NgTemplateOutlet,
    IonButtons,
    IonRow,
    IonCol
  ],
  templateUrl: './brand-form.component.html',
  providers: [PermissionStore],
})
export default class BrandFormComponent implements IHasUnsavedChanges {
  brandItems = signal<IUpdateBrandCatalogueInput[]>([]);
  #modalCtrl = inject(ModalController);
  #alertController = inject(AlertController);
  #fb = inject(FormBuilder);
  #createRoleGQL = inject(ICreateBrandGQL);
  #updateRoleGQL = inject(IUpdateBrandGQL);
  brandForm = this.#fb.group({
    name: ['', [Validators.required]],
    companyName: [''],
    images: [[] as ISelectCategory[]],
  });
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  brand = input<IBrandModel>();
  isEditing = computed(() => !!this.brand());
  roleId = computed(() => this.brand()?.id);
  brandChangeEffect = effect(() => {
    const brand = this.brand();
    untracked(() => {
      if (brand) {
        this.brandForm.patchValue({
          name: brand.name,
          companyName: brand.companyName,
          images: brand.images?.map((x) => ({ id: x?.id as string })),
        });
      }
    });
  });

  async onSubmit() {
    this.brandForm.updateValueAndValidity();
    if (this.brandForm.valid) {
      const { name, companyName, images } = this.brandForm.value;
      const params = {
        name: name as string,
        companyName: companyName as string,
        images: images?.map((x) => ({ id: x?.id as string })),
        catalogues: this.brandItems().map(
          ({ id, pricePerUnit, quantityPerUnit, name, unit, description }) => ({
            id,
            pricePerUnit,
            quantityPerUnit,
            name,
            unit,
            description,
          })
        ),
      };

      const context = {
        [SHOW_ERROR_MESSAGE]: true,
        [SHOW_SUCCESS_MESSAGE]: true,
      };

      if (this.isEditing() && this.roleId()) {
        this.#updateRoleGQL
          .mutate({ id: this.roleId() as string, params }, { context })
          .subscribe({
            next: async () => {
              await this.#router.navigate(['../../'], {
                relativeTo: this.#route,
              });
            },
          });
      } else {
        this.#createRoleGQL.mutate({ params }, { context }).subscribe({
          next: async () => {
            await this.#router.navigate(['../'], { relativeTo: this.#route });
          },
        });
      }
    }
  }

  async openAddItemModal(item?: IUpdateBrandCatalogueInput) {
    const modal = await this.#modalCtrl.create({
      component: BrandItemModalComponent,
      componentProps: {
        item: item, // Pass the item if editing
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      if (item) {
        // Update existing item
        this.brandItems.update((brandItems) => {
          const index = brandItems.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            brandItems[index] = data;
          }
          return [...brandItems];
        });
      } else {
        // Add new item
        this.brandItems.update((brandItems) => {
          data.id = crypto.randomUUID(); // Add unique ID for new items
          brandItems.push(data);
          return [...brandItems];
        });
      }
    }
  }

  async confirm() {
    if (this.brandItems().length === 0) {
      // Show error or warning that items are required
      // You might want to use Ionic's Toast or Alert here
      return;
    }

    // Proceed with saving brand and its items
    const brandData = {
      // ... other brand fields ...
      items: this.brandItems(),
    };
    // Call your service method to save
  }

  async removeItem(item: IUpdateBrandCatalogueInput) {
    const alert = await this.#alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to remove this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Remove',
          role: 'confirm',
          handler: () => {
            this.brandItems.update((items) =>
              items.filter((i) => i.id !== item.id)
            );
          },
        },
      ],
    });

    await alert.present();
  }

  get hasUnsavedChanges() {
    return this.brandForm.dirty;
  }
}
