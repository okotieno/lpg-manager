import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
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
import {
  ICreateUserGQL,
  IGetUserByIdQuery,
  IUpdateUserGQL,
} from '@lpg-manager/user-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IGetRolesQuery, RoleStore } from '@lpg-manager/role-store';
import { IUserRoleInput } from '@lpg-manager/types';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { PaginatedResource } from '@lpg-manager/data-table';
import { IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { IGetStationsQuery, StationStore } from '@lpg-manager/station-store';
import { MaskitoDirective } from '@maskito/angular';
import { kenyaPhoneMask } from '../utils/phone-mask.util';
import { MaskitoElementPredicate } from '@maskito/core';

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
    MaskitoDirective,
    JsonPipe,
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
  styles: `
    ion-list {
      ion-item {
        --background: rgba(var(--ion-color-medium-rgb), 0.05);
      }
    }
  `,
})
export default class UserFormComponent implements IHasUnsavedChanges {
  #fb = inject(FormBuilder);
  #createUserGQL = inject(ICreateUserGQL);
  #updateUserGQL = inject(IUpdateUserGQL);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #alertController = inject(AlertController);
  protected readonly phoneMask = kenyaPhoneMask;
  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
    (el as HTMLIonInputElement).getInputElement();
  userForm = this.#fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [
        Validators.pattern(/^\+254 [17]\d{2} \d{3} \d{3}$/),
        Validators.required,
      ],
    ],
    roles: this.#fb.array(
      [] as Array<{
        id: string;
        role: { id: string };
        station?: { id: string };
      }>
    ),
  });
  rolesList = signal<
    {
      id: string;
      role: { id: string };
      station?: { id: string };
    }[]
  >([]);
  user = input<IGetUserByIdQuery['user']>();
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
            role: [
              role?.role.id ? { id: role?.role.id } : null,
              Validators.required,
            ],
            station: [
              role?.station.id ? { id: role?.station.id } : null,
              Validators.required,
            ],
          });
          this.roles.push(roleForm);
          this.rolesList.set(this.roles.value);
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
      role: [null as null | { id: string }, Validators.required],
      station: [null as null | { id: string }, [Validators.required]],
    });
    this.roles.push(roleForm);
    this.rolesList.set(this.roles.value);
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
            this.rolesList.set(this.roles.value);
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
              roles: roles as unknown as IUserRoleInput[],
            },
          })
          .subscribe({
            next: async () => {
              this.userForm.reset();
              await this.#router.navigate(['../users'], {
                relativeTo: this.#route,
              });
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
                  roleId: user?.role.id as string,
                  stationId: user?.station?.id as string,
                })) ?? [],
            },
          })
          .subscribe({
            next: async () => {
              this.userForm.reset();
              await this.#router.navigate(['../../users'], {
                relativeTo: this.#route,
              });
            },
          });
      }
    }
  }

  get hasUnsavedChanges() {
    return this.userForm.dirty;
  }
}
