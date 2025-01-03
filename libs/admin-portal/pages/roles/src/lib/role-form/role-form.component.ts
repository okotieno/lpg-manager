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
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ICreateRoleGQL,
  IGetRoleByIdQuery,
  IUpdateRoleGQL,
} from '@lpg-manager/role-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import {
  IGetPermissionsQuery,
  PermissionStore,
} from '@lpg-manager/permission-store';
import { ISelectCategory } from '@lpg-manager/types';
import { PaginatedResource } from '@lpg-manager/data-table';

type PermissionItem =     NonNullable<
  NonNullable<IGetPermissionsQuery['permissions']['items']>[number]
>

@Component({
  selector: 'lpg-role-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonButton,
    RouterLink,
    SearchableSelectComponent,
    IonCol,
    IonRow,
  ],
  templateUrl: './role-form.component.html',
  providers: [PermissionStore],
})
export default class RoleFormComponent {
  #fb = inject(FormBuilder);
  #createRoleGQL = inject(ICreateRoleGQL);
  #updateRoleGQL = inject(IUpdateRoleGQL);
  permissionsStore = inject(PermissionStore) as PaginatedResource<PermissionItem>;
  #router = inject(Router);
  #route = inject(ActivatedRoute);

  roleForm = this.#fb.group({
    name: ['', [Validators.required]],
    permissions: [[] as ISelectCategory[]],
  });

  role = input<IGetRoleByIdQuery['role']>();
  isEditing = computed(() => !!this.role());
  roleId = computed(() => this.role()?.id);

  roleChangeEffect = effect(() => {
    const role = this.role();
    const permissions =
      role?.permissions?.map((permission) => ({
        id: permission?.id as string,
      })) ?? [];
    untracked(() => {
      if (role) {
        this.roleForm.patchValue({
          name: role.name,
          permissions,
        });
      }
    });
  });

  async onSubmit() {
    if (this.roleForm.valid) {
      const { name, permissions } = this.roleForm.value;
      const params = {
        name: name as string,
        permissions:
          permissions?.map((permission) => ({ id: permission.id as string })) ??
          [],
      };

      if (this.isEditing()) {
        this.#updateRoleGQL
          .mutate({
            id: this.roleId() as string,
            params,
          })
          .subscribe({
            next: async () => {
              await this.#router.navigate(['../'], {
                relativeTo: this.#route,
              });
            },
          });
      } else {
        this.#createRoleGQL.mutate({ params }).subscribe({
          next: async () => {
            await this.#router.navigate(['../'], {
              relativeTo: this.#route,
            });
          },
        });
      }
    }
  }
}
