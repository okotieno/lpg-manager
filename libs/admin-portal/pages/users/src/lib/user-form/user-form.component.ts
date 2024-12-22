import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonInput,
  IonItem
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICreateUserGQL, IUpdateUserGQL } from '@lpg-manager/user-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleStore } from '@lpg-manager/role-store';
import { IRoleModel, ISelectCategory } from '@lpg-manager/types';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { PaginatedResource } from '@lpg-manager/data-table';

@Component({
  selector: 'lpg-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonCard,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    RouterLink,
    SearchableSelectComponent,
  ],
  templateUrl: './user-form.component.html',
  providers: [RoleStore],
})
export default class UserFormComponent {
  #fb = inject(FormBuilder);
  #createUserGQL = inject(ICreateUserGQL);
  #updateUserGQL = inject(IUpdateUserGQL);
  #router = inject(Router);
  #route = inject(ActivatedRoute);

  rolesStore: PaginatedResource<IRoleModel> = inject(RoleStore);

  userForm = this.#fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    roles: [[] as ISelectCategory[]],
  });

  isEditing = false;
  userId: string | null = null;

  constructor() {
    const userId = this.#route.snapshot.paramMap.get('id');
    if (userId) {
      this.isEditing = true;
      this.userId = userId;
      const user = this.#route.snapshot.data['user'];
      if (user) {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          roles: user.roles,
        });
      }
    }
  }

  async onSubmit() {
    if (this.userForm.valid) {
      const { firstName, lastName, email, phone, roles } = this.userForm.value;

      if (this.isEditing && this.userId) {
        this.#updateUserGQL
          .mutate({
            id: this.userId,
            params: {
              firstName: firstName as string,
              lastName: lastName as string,
              email: email as string,
              phone: phone as string,
              roles: roles as unknown as ISelectCategory[],
            },
          })
          .subscribe({
            next: async () => {
              await this.#router.navigate(['/users']);
            },
          });
      } else {
        this.#createUserGQL
          .mutate({
            params: {
              firstName: firstName as string,
              lastName: lastName as string,
              email: email as string,
              phone: phone as string,
              roles:
                this.userForm
                  .get('roles')
                  ?.value?.map((user) => ({ id: user.id })) ?? [],
            },
          })
          .subscribe({
            next: async () => {
              await this.#router.navigate(['/users']);
            },
          });
      }
    }
  }
}
