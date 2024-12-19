import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { RoleStore } from '@lpg-manager/role-store';
import { DataTableComponent, ITableColumn } from '@lpg-manager/data-table';
import { PaginatedResource } from '@lpg-manager/data-table';
import { IRoleModel } from '@lpg-manager/types';

@Component({
  selector: 'lpg-roles-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent],
  template: `<lpg-data-table
    pageTitle="Roles"
    createNewIcon="shield-plus"
    createNewLabel="New Role"
    [store]="rolesStore"
    [columns]="allColumns"
  ></lpg-data-table>`,
  providers: [RoleStore],
})
export default class RolesLandingPageComponent {
  rolesStore = inject(RoleStore) as PaginatedResource<IRoleModel>;
  protected readonly allColumns: ITableColumn<IRoleModel>[] = [
    { label: 'ID', key: 'id', fieldType: 'uuid' },
    { label: 'Name', key: 'name', fieldType: 'string' },
  ];
}
