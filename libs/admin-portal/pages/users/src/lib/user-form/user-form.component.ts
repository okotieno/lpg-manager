import {
  Component,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  IonButton,
  IonCol,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRow,
  AlertController,
} from '@ionic/angular/standalone';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ICreateUserGQL, IUpdateUserGQL } from '@lpg-manager/user-store';
import { Router, RouterLink } from '@angular/router';
import { IGetRolesQuery, RoleStore } from '@lpg-manager/role-store';
import { ISelectCategory, IUserModel } from '@lpg-manager/types';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { PaginatedResource } from '@lpg-manager/data-table';
import { IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';
import { NgTemplateOutlet } from '@angular/common';
import { IGetStationsQuery, StationStore } from '@lpg-manager/station-store';

@Component({
  selector: 'lpg-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonButton,
    RouterLink,
    SearchableSelectComponent,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonIcon,
    IonLabel,
    NgTemplateOutlet,
  ],
  templateUrl: './user-form.component.html',
  providers: [RoleStore, StationStore],
  animations: [
    trigger('roleAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          maxHeight: '0',
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)',
            maxHeight: '500px',
          })
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translateY(0)',
          maxHeight: '500px',
        }),
        animate(
          '300ms ease-in',
          style({
            opacity: 0,
            transform: 'translateY(-20px)',
            maxHeight: '0',
          })
        ),
      ]),
    ]),
  ],
})
export default class UserFormComponent implements IHasUnsavedChanges {
  #fb = inject(FormBuilder);
  #createUserGQL = inject(ICreateUserGQL);
  #updateUserGQL = inject(IUpdateUserGQL);
  #router = inject(Router);
  #alertController = inject(AlertController);
  userForm = this.#fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    roles: this.#fb.array(
      [] as Array<{
        id: string;
        role: { id: string };
        station?: { id: string };
      }>
    ),
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

        while (this.roles.length) {
          this.roles.removeAt(0);
        }

        // Add existing roles if any
        user.roles?.forEach((role) => {
          const roleForm = this.#fb.group({
            id: [role?.id, Validators.required],
            role: [role?.roleId ? { id: role.roleId } : null, Validators.required],
            station: [role?.stationId || '', Validators.required],
          });
          this.roles.push(roleForm);
        });
      }
    });
  });

  roleStore: PaginatedResource<
    NonNullable<NonNullable<IGetRolesQuery['roles']['items']>[number]>
  > = inject(RoleStore);

  stationStore: PaginatedResource<
    NonNullable<NonNullable<IGetStationsQuery['stations']['items']>[number]>
  > = inject(StationStore);

  get roles() {
    return this.userForm.get('roles') as FormArray;
  }

  addRole() {
    const roleForm = this.#fb.group({
      id: [crypto.randomUUID(), Validators.required],
      role: [null, Validators.required],
      station: [null, [Validators.required]],
    });
    this.roles.push(roleForm);
  }

  async removeRole(index: number) {
    const alert = await this.#alertController.create({
      header: 'Confirm Removal',
      message: 'Are you sure you want to remove this role?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            this.roles.removeAt(index);
          },
        },
      ],
    });

    await alert.present();
  }

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
                this.userForm.get('roles')?.value?.map((user) => ({
                  id: user?.id as string,
                  roleId: user?.id as string,
                  stationId: user?.station?.id as string,
                })) ?? [],
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

  get hasUnsavedChanges() {
    return this.userForm.dirty;
  }
}
