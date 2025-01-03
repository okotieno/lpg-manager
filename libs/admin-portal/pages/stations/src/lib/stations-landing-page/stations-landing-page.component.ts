import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { StationStore } from '@lpg-manager/station-store';
import {
  DataTableComponent,
  ITableColumn,
  PaginatedResource,
} from '@lpg-manager/data-table';
import { IStationModel } from '@lpg-manager/types';

@Component({
  selector: 'lpg-stations-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent],
  template: `<lpg-data-table
    createNewIcon="plus"
    [store]="stationStore"
    [columns]="allColumns"
  ></lpg-data-table>`,
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
