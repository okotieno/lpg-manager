import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  UserStore,
} from '@lpg-manager/user-store';
import {
  DataTableComponent,
  ITableColumn,
  PaginatedResource,
} from '@lpg-manager/data-table';
import { IUserModel } from '@lpg-manager/types';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DataTableComponent,
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
  providers: [UserStore]
})
export default class UsersPageComponent {
  userStore: PaginatedResource<IUserModel> = inject(UserStore);
  protected readonly allColumns: ITableColumn<IUserModel>[] = [
    { label: 'ID', key: 'id', fieldType: 'uuid' },
    { label: 'Email', key: 'email', fieldType: 'string' },
    { label: 'First Name', key: 'firstName', fieldType: 'string' },
    { label: 'Last Name', key: 'lastName', fieldType: 'string' },
    // { label: 'Roles', key: 'roles', fieldType: 'string' },
  ];
}
