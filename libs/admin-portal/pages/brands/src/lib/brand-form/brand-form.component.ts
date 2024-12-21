import {
  Component,
  computed,
  effect,
  inject,
  input, signal,
  untracked
} from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent, IonIcon,
  IonInput,
  IonItem, IonLabel, IonList, IonListHeader,
  IonText
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PermissionsStore } from '@lpg-manager/permission-store';
import { ICreateBrandGQL, IUpdateBrandGQL } from '@lpg-manager/brand-store';
import { IBrandModel, ISelectCategory } from '@lpg-manager/types';
import { FileUploadComponent } from '@lpg-manager/file-upload-component';
import { ModalController } from '@ionic/angular/standalone';
import { BrandItemModalComponent } from './brand-item-modal/brand-item-modal.component';

@Component({
  selector: 'lpg-brand-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonCard,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    RouterLink,
    FileUploadComponent,
    FileUploadComponent,
    IonList,
    IonListHeader,
    IonLabel,
    IonIcon
  ],
  templateUrl: './brand-form.component.html',
  providers: [PermissionsStore],
})
export default class BrandFormComponent {
  brandItems = signal<any[]>([]);
  #modalCtrl = inject(ModalController);
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

      if (this.isEditing() && this.roleId()) {
        this.#updateRoleGQL
          .mutate({
            id: this.roleId() as string,
            params: {
              name: name as string,
              companyName: companyName as string,
              images: images?.map((x) => ({ id: x?.id as string })),
            },
          })
          .subscribe({
            next: async () => {
              await this.#router.navigate(['../../'], {
                relativeTo: this.#route,
              });
            },
          });
      } else {
        this.#createRoleGQL
          .mutate({
            params: {
              name: name as string,
              companyName: companyName as string,
              images: images?.map((x) => ({ id: x?.id as string })),
            },
          })
          .subscribe({
            next: async () => {
              await this.#router.navigate(['../'], { relativeTo: this.#route });
            },
          });
      }
    }
  }
  async openAddItemModal() {
    const modal = await this.#modalCtrl.create({
      component: BrandItemModalComponent,
      componentProps: {
        // Add any props you want to pass to the modal
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.brandItems.update((brandItems) => {
        brandItems.push(data);
        return [...brandItems]
      });
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
      items: this.brandItems()
    };
    // Call your service method to save
  }
  removeItem(item: any) {
    const index = this.brandItems().indexOf(item);
    if (index > -1) {
      this.brandItems.update((brandItems) => {
        brandItems.splice(index, 1);
        return brandItems
      });
    }
  }
}
