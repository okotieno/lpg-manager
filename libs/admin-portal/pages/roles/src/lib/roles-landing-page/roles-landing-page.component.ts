import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { IGetRolesQuery, RoleStore } from '@lpg-manager/role-store';
import {
  DataTableComponent,
  ITableColumn,
  PaginatedResource,
} from '@lpg-manager/data-table';

@Component({
  selector: 'lpg-roles-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent],
  template: `<lpg-data-table
    createNewIcon="shield-plus"
    createNewLabel="New Role"
    [store]="rolesStore"
    [columns]="allColumns"
  ></lpg-data-table>`,
  providers: [RoleStore],
})
export default class RolesLandingPageComponent {
  rolesStore = inject(RoleStore) as PaginatedResource<
    NonNullable<NonNullable<IGetRolesQuery['roles']['items']>[number]>
  >;
  protected readonly allColumns: ITableColumn<
    NonNullable<NonNullable<IGetRolesQuery['roles']['items']>[number]>
  >[] = [
    { label: 'ID', key: 'id', fieldType: 'uuid' },
    { label: 'Name', key: 'name', fieldType: 'string' },
  ];
}
