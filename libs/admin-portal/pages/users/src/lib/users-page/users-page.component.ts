import { Component, inject, signal } from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox, IonInput, IonListHeader
} from '@ionic/angular/standalone';
// import { RoleService } from '@lpg-manager/role-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { IGetUsersGQL, IGetUsersQuery } from '@lpg-manager/user-store';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonSearchbar,
    IonCol,
    IonButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonLabel,
    IonItem,
    IonInput,
    IonList,
    IonListHeader,
    IonCheckbox,
    NgForOf,
    IonAlert,
  ],
  templateUrl: './users-page.component.html',
  styles: `

  `,
})
export default class UserTableComponent {
  private getUsersGQL = inject(IGetUsersGQL);
  // private roleService = inject(RoleService);
  private fb = inject(FormBuilder);

  users = signal<IGetUsersQuery['users']['items']>([]);
  filteredUsers = signal<any[]>([]);
  availableRoles = signal<any[]>([]);
  isModalOpen = signal(false);
  editingUser = signal<any>(null);
  userToDelete = signal<any>(null);
  showUnsavedChangesAlert = signal(false);

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    roles: [[]],
  });

  showUnsavedChangesAlertButton = [
    {
      text: 'Cancel',
      role: 'cancel',
      // handler: () => this.setShowUnsavedChangesAlert(false)
    },
    {
      text: 'Discard',
      role: 'confirm',
      handler: () => this.discardChanges()
    }
  ];

  userToDeleteButton = [
    {
      text: 'Cancel',
      role: 'cancel',
      // handler: () => setUserToDelete(null)
    },
    {
      text: 'Delete',
      role: 'confirm',
      // handler: () => deleteUser()
    }
  ];

  constructor() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.getUsersGQL.fetch().subscribe((usersResponse) => {
      const users = usersResponse.data.users.items ?? [];
      if (users.length > 0) {
        this.users.set(users);
      }

      this.filteredUsers.set(users);
    });
  }

  async loadRoles() {
    // const roles = await this.roleService.findAll();
    // this.availableRoles.set(roles);
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    // this.filteredUsers.set(
    //   this.users().filter(user =>
    //     user.firstName.toLowerCase().includes(query) ||
    //     user.lastName.toLowerCase().includes(query) ||
    //     user.email.toLowerCase().includes(query)
    //   )
    // );
  }

  sort(column: string) {
    const sorted = [...this.filteredUsers()].sort((a, b) =>
      a[column].localeCompare(b[column])
    );
    this.filteredUsers.set(sorted);
  }

  openNewUserModal() {
    this.userForm.reset();
    this.editingUser.set(null);
    this.isModalOpen.set(true);
  }

  editUser(user: any) {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    });
    this.editingUser.set(user);
    this.isModalOpen.set(true);
  }

  async saveUser() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.editingUser()) {
        // await this.userService.update(this.editingUser().id, userData);
      } else {
        // await this.userService.create(userData);
      }
      this.loadUsers();
      this.isModalOpen.set(false);
    }
  }

  confirmDelete(user: any) {
    this.userToDelete.set(user);
  }

  async deleteUser() {
    if (this.userToDelete()) {
      // await this.userService.delete(this.userToDelete().id);
      // this.loadUsers();
      // this.userToDelete.set(null);
    }
  }

  handleModalDismiss(event: any) {
    if (this.userForm.dirty && event.role === 'cancel') {
      this.showUnsavedChangesAlert.set(true);
      return false;
    }
    return true;
  }

  cancelEdit() {
    if (this.userForm.dirty) {
      this.showUnsavedChangesAlert.set(true);
    } else {
      this.isModalOpen.set(false);
    }
  }

  discardChanges() {
    this.showUnsavedChangesAlert.set(false);
    this.isModalOpen.set(false);
    this.userForm.reset();
  }

  isRoleSelected(role: any): boolean {
    // return this.userForm.value.roles?.includes(role.id);
    return false;
  }

  toggleRole(role: any) {
    // const currentRoles = this.userForm.value.roles || [];
    // const index = currentRoles.indexOf(role.id);
    // if (index === -1) {
    //   currentRoles.push(role.id);
    // } else {
    //   currentRoles.splice(index, 1);
    // }
    // this.userForm.patchValue({ roles: currentRoles });
  }
}
