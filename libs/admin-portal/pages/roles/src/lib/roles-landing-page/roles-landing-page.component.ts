import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { IGetRolesQuery, RoleStore } from '@lpg-manager/role-store';
import {
  DataTableComponent,
  ITableColumn,
  PaginatedResource,
} from '@lpg-manager/data-table';
import { IonCol, IonContent, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-roles-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent, IonContent, IonRow, IonCol],
  template: `
    <ion-content class="ion-padding">
      <ion-row>
        <ion-col class="ion-padding-horizontal">
          <lpg-data-table
            createNewIcon="shield-plus"
            createNewLabel="New Role"
            [store]="rolesStore"
            [columns]="allColumns"
          ></lpg-data-table>
        </ion-col>
      </ion-row>
    </ion-content> `,
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
    { label: 'Name', key: 'label', fieldType: 'string' },
  ];
}
