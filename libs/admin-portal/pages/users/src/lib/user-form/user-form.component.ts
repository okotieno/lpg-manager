import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonInput,
  IonItem
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICreateUserGQL, IUpdateUserGQL } from '@lpg-manager/user-store';
import { Router, RouterLink } from '@angular/router';
import { RoleStore } from '@lpg-manager/role-store';
import { IRoleModel, ISelectCategory, IUserModel } from '@lpg-manager/types';
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
  userForm = this.#fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    roles: [[] as ISelectCategory[]],
  });
  user = input<IUserModel>();
  isEditing = computed(() => !!this.user());
  userId = computed(() => this.user()?.id);
  userChangeEffect = effect(() => {
    const user = this.user();
    untracked(() => {
      if (user) {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        });
      }
    });
  });

  rolesStore: PaginatedResource<IRoleModel> = inject(RoleStore);


  async onSubmit() {
    if (this.userForm.valid) {
      const { firstName, lastName, email, phone, roles } = this.userForm.value;

      if (this.isEditing()) {
        this.#updateUserGQL
          .mutate({
            id: this.userId() as string,
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
