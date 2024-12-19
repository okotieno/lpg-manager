import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonInput,
  IonItem,
  IonText,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PermissionsStore } from '@lpg-manager/permission-store';
import { ICreateBrandGQL, IUpdateBrandGQL } from '@lpg-manager/brand-store';
import { IBrandModel } from '@lpg-manager/types';

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
    RouterLink
  ],
  templateUrl: './brand-form.component.html',
  providers: [PermissionsStore],
})
export default class BrandFormComponent {
  #fb = inject(FormBuilder);
  #createRoleGQL = inject(ICreateBrandGQL);
  #updateRoleGQL = inject(IUpdateBrandGQL);
  brandForm = this.#fb.group({
    name: ['', [Validators.required]],
    companyName: [''],
  });
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  brand = input<IBrandModel>();
  isEditing = computed(() => !!this.brand());
  roleId = computed(() => this.brand()?.id);
  brandChangeEffect = effect(() => {
    const brand = this.brand();
    untracked(() => {
      if(brand) {
        this.brandForm.patchValue(brand);
      }
    })
  })

  async onSubmit() {
    if (this.brandForm.valid) {
      const { name, companyName } = this.brandForm.value;

      if (this.isEditing() && this.roleId()) {
        this.#updateRoleGQL
          .mutate({
            id: this.roleId() as string,
            params: {
              name: name as string,
              companyName: companyName as string,
            }
          })
          .subscribe({
            next: async () => {
              await this.#router.navigate(['../../'], {relativeTo: this.#route});
            },
          });
      } else {
        this.#createRoleGQL
          .mutate({
            params: {
              name: name as string,
              companyName: companyName as string
            },
          })
          .subscribe({
            next: async () => {
              await this.#router.navigate(['../'], {relativeTo: this.#route});
            },
          });
      }
    }
  }
}
