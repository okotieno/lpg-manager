import {
  Component,
  computed,
  DestroyRef,
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
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  GetUserByIdDocument,
  ICreateUserGQL,
  IGetUserByIdQuery,
  IUpdateUserGQL
} from '@lpg-manager/user-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IGetRolesQuery, RoleStore } from '@lpg-manager/role-store';
import {
  IQueryOperatorEnum,
} from '@lpg-manager/types';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { PaginatedResource } from '@lpg-manager/data-table';
import { IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';
import { IGetStationsQuery, StationStore } from '@lpg-manager/station-store';
import { MaskitoDirective } from '@maskito/angular';
import { kenyaPhoneMask } from '../utils/phone-mask.util';
import { MaskitoElementPredicate } from '@maskito/core';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';

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
    MaskitoDirective,
    IonSelect,
    IonSelectOption,
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
        padding-left: 1rem;
        border-left: 4px solid rgba(var(--ion-color-medium-rgb), 0.3);
      }
    }
  `,
})
export default class UserFormComponent implements IHasUnsavedChanges {
  #fb = inject(FormBuilder);
  #destroyRef = inject(DestroyRef);
  #createUserGQL = inject(ICreateUserGQL);
  #updateUserGQL = inject(IUpdateUserGQL);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #alertController = inject(AlertController);
  protected readonly phoneMask = kenyaPhoneMask;
  protected readonly equalsOperator = IQueryOperatorEnum.Equals;
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
        stationType: null | string;
      }>
    ),
  });
  rolesList = signal<
    {
      id: string;
      role: { id: string };
      station?: { id: string };
      stationType: null | string;
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
              role?.role?.id ? { id: role.role.id } : null,
              Validators.required,
            ],
            station: [
              role?.station?.id ? { id: role.station.id } : null,
              Validators.required,
            ],
            stationType: role?.station?.type ?? null,
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

  stationStore = inject(StationStore) as PaginatedResource<
    NonNullable<NonNullable<IGetStationsQuery['stations']['items']>[number]>
  >;

  get roles() {
    return this.userForm.get('roles') as FormArray;
  }

  addRole() {
    const roleForm = this.#fb.group({
      id: [crypto.randomUUID(), Validators.required],
      role: [null as null | { id: string }, Validators.required],
      stationType: [null as null | string],
      station: [
        { value: null as null | { id: string }, disabled: true },
        [Validators.required],
      ],
    });
    roleForm
      .get('stationType')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.#destroyRef),
        tap(() => {
          roleForm.get('station')?.enable();
          roleForm.get('station')?.setValue(null);
          roleForm.get('station')?.updateValueAndValidity();
        })
      )
      .subscribe();
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
      const params = {
        firstName: firstName as string,
        lastName: lastName as string,
        email: email as string,
        phone: phone as string,
        roles:
          roles?.map((user) => ({
            id: user?.id as string,
            roleId: user?.role.id as string,
            stationId: user?.station?.id as string,
          })) ?? [],
      };

      if (this.isEditing()) {
        this.#updateUserGQL
          .mutate(
            { id: this.userId() as string, params },
            {
              context: {
                [SHOW_ERROR_MESSAGE]: true,
                [SHOW_SUCCESS_MESSAGE]: true,
              },
              awaitRefetchQueries: true,
              refetchQueries: [
                {
                  query: GetUserByIdDocument,
                  variables: {
                    id: this.userId(),
                  }
                }
              ]
            },
          )
          .subscribe({
            next: async () => {
              this.userForm.reset();
              // await this.#router.navigateByUrl('/user-management/users');
              console.log(this.#route);
              await this.#router.navigate(['../'], {relativeTo: this.#route});
            },
          });
      } else {
        this.#createUserGQL
          .mutate(
            { params },
            {
              context: {
                [SHOW_ERROR_MESSAGE]: true,
                [SHOW_SUCCESS_MESSAGE]: true,
              },
            }
          )
          .subscribe({
            next: async (res) => {
              console.log(res);
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
