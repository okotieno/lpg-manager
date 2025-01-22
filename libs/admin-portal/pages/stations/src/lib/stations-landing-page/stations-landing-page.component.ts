import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { StationStore } from '@lpg-manager/station-store';
import {
  DataTableComponent,
  ITableColumn,
  PaginatedResource,
} from '@lpg-manager/data-table';
import { IStationModel } from '@lpg-manager/types';
import { IonCol, IonContent, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-stations-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent, IonContent, IonRow, IonCol],
  template: `
    <ion-content class="ion-padding-horizontal">
      <ion-row>
        <ion-col class="ion-padding">
          <lpg-data-table
            createNewIcon="plus"
            [store]="stationStore"
            [columns]="allColumns"
          />
        </ion-col>
      </ion-row>
    </ion-content>
  `,
  providers: [StationStore],
})
export default class StationsLandingPageComponent {
  stationStore = inject(StationStore) as PaginatedResource<IStationModel>;
  protected readonly allColumns: ITableColumn<IStationModel>[] = [
    { label: 'ID', key: 'id', fieldType: 'uuid' },
    { label: 'Name', key: 'name', fieldType: 'string' },
    {
      label: 'Type',
      key: 'type',
      fieldType: 'enum',
      enumList: [
        { value: 'DEPOT', label: 'Depot' },
        { value: 'DEALER', label: 'Dealer' },
      ],
    },
  ];
}
