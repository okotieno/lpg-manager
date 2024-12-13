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
import { ICreateRoleGQL, IUpdateRoleGQL } from '@lpg-manager/roles-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchableSelectComponent } from '@lpg-manager/searchable-select';
import { IGetPermissionsGQL } from '@lpg-manager/permission-store';

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
  template: `
    <h2>
      <ion-text color="lpg-title">
        {{ isEditing ? 'Edit Role' : 'Create Role' }}
      </ion-text>
    </h2>

    <ion-card class="ion-no-margin">
      <ion-card-content>
        <form [formGroup]="roleForm" (ngSubmit)="onSubmit()">
          <ion-item lines="none">
            <ion-input
              label="Name"
              labelPlacement="stacked"
              formControlName="name"
              placeholder="Enter role name"
              errorText="Role is required"
              helperText="&nbsp;"
            >
            </ion-input>
          </ion-item>

          <ion-item lines="none">
            <lpg-searchable-select
              [service]="fetchPermissions"
              label="Name"
              labelPlacement="stacked"
              formControlName="name"
              placeholder="Select permission"
            ></lpg-searchable-select>
          </ion-item>

          <div class="ion-margin-top ion-text-end">
            <ion-button fill="clear" type="button" [routerLink]="['/roles']">
              Cancel
            </ion-button>
            <ion-button type="submit" [disabled]="!roleForm.valid">
              {{ isEditing ? 'Update' : 'Create' }}
            </ion-button>
          </div>
        </form>
      </ion-card-content>
    </ion-card>
  `,
})
export default class RoleFormComponent {
  private fb = inject(FormBuilder);
  private createRoleGQL = inject(ICreateRoleGQL);
  private updateRoleGQL = inject(IUpdateRoleGQL);
  getPermissionsGQL = inject(IGetPermissionsGQL);
  fetchPermissions = this.getPermissionsGQL.fetch.bind(this.getPermissionsGQL)
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roleForm = this.fb.group({
    name: ['', [Validators.required]],
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
            name: name as string,
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
