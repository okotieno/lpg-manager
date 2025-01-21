import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import {
  IGetTransportersQuery,
  TransporterStore,
} from '@lpg-manager/transporter-store';
import {
  DataTableComponent,
  ITableColumn,
  PaginatedResource,
} from '@lpg-manager/data-table';
import { IonCol, IonContent, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-transporters-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent, IonContent, IonRow, IonCol],
  template: `
    <ion-content class="ion-padding">
      <ion-row>
        <ion-col class="ion-padding-horizontal">
          <lpg-data-table
            createNewIcon="plus"
            [store]="transporterStore"
            [columns]="allColumns"
          ></lpg-data-table>
        </ion-col>
      </ion-row>
    </ion-content>
  `,
  providers: [TransporterStore],
})
export default class TransportersLandingPageComponent {
  transporterStore = inject(TransporterStore) as PaginatedResource<
    NonNullable<
      NonNullable<IGetTransportersQuery['transporters']['items']>[number]
    >
  >;
  protected readonly allColumns: ITableColumn<
    NonNullable<
      NonNullable<IGetTransportersQuery['transporters']['items']>[number]
    >
  >[] = [
    { label: 'ID', key: 'id', fieldType: 'uuid' },
    { label: 'Name', key: 'name', fieldType: 'string' },
    { label: 'Contact Person', key: 'contactPerson', fieldType: 'string' },
    { label: 'Contact Number', key: 'phone', fieldType: 'string' },
  ];
}
