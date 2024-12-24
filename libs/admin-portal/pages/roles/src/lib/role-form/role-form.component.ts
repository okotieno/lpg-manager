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
import { ICreateRoleGQL, IUpdateRoleGQL } from '@lpg-manager/role-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import {
  IGetPermissionsQuery,
  PermissionsStore,
} from '@lpg-manager/permission-store';
import { IPermissionModel, ISelectCategory } from '@lpg-manager/types';
import { PaginatedResource } from '@lpg-manager/data-table';
import { IGetCataloguesQuery } from '@lpg-manager/catalogue-store';

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
    RouterLink,
    SearchableSelectComponent,
  ],
  templateUrl: './role-form.component.html',
  providers: [PermissionsStore],
})
export default class RoleFormComponent {
  private fb = inject(FormBuilder);
  private createRoleGQL = inject(ICreateRoleGQL);
  private updateRoleGQL = inject(IUpdateRoleGQL);
  permissionsStore = inject(PermissionsStore) as PaginatedResource<
    NonNullable<
      NonNullable<IGetPermissionsQuery['permissions']['items']>[number]
    >
  >;
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roleForm = this.fb.group({
    name: ['', [Validators.required]],
    permissions: [[] as ISelectCategory[]],
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
      const { name } = this.roleForm.value;

      if (this.isEditing && this.roleId) {
        this.updateRoleGQL
          .mutate({
            id: this.roleId,
            name: name as string,
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
              permissions:
                this.roleForm
                  .get('permissions')
                  ?.value?.map((role) => ({ id: role.id })) ?? [],
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
