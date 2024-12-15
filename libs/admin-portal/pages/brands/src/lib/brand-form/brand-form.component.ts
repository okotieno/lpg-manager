import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'lpg-role-form',
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
  private fb = inject(FormBuilder);
  private createRoleGQL = inject(ICreateBrandGQL);
  private updateRoleGQL = inject(IUpdateBrandGQL);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roleForm = this.fb.group({
    name: ['', [Validators.required]],
    companyName: [''],
  });

  isEditing = false;
  roleId: string | null = null;

  constructor() {
    const roleId = this.route.snapshot.paramMap.get('id');
    if (roleId) {
      this.isEditing = true;
      this.roleId = roleId;
      // Load role data if editing
      const role = this.route.snapshot.data['role'];
      if (role) {
        this.roleForm.patchValue({
          name: role.name,
        });
      }
    }
  }

  async onSubmit() {
    if (this.roleForm.valid) {
      const { name, companyName } = this.roleForm.value;

      if (this.isEditing && this.roleId) {
        this.updateRoleGQL
          .mutate({
            id: this.roleId,
            params: {
              name: name as string,
              companyName: companyName as string,
            }
          })
          .subscribe({
            next: async () => {
              await this.router.navigate(['/roles']);
            },
          });
      } else {
        this.createRoleGQL
          .mutate({
            params: {
              name: name as string,
              companyName: companyName as string
            },
          })
          .subscribe({
            next: async () => {
              await this.router.navigate(['/roles']);
            },
          });
      }
    }
  }
}
