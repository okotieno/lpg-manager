import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { StationsStore } from '@lpg-manager/station-store';
import { DataTableComponent, ITableColumn } from '@lpg-manager/data-table';
import { PaginatedResource } from '@lpg-manager/data-table';
import { IStationModel } from '@lpg-manager/types';

@Component({
  selector: 'lpg-stations-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent],
  template: `<lpg-data-table
    pageTitle="Stations"
    createNewIcon="plus"
    [store]="stationsStore"
    [columns]="allColumns"
  ></lpg-data-table>`,
  providers: [StationsStore],
})
export default class StationsLandingPageComponent {
  stationsStore = inject(StationsStore) as PaginatedResource<IStationModel>;
  protected readonly allColumns: ITableColumn<IStationModel>[] = [
    { label: 'ID', key: 'id', fieldType: 'uuid' },
    { label: 'Name', key: 'name', fieldType: 'string' },
    { label: 'Type', key: 'type', fieldType: 'enum', enumList: [{ value: 'DEPOT', label: 'Depot' }, { value: 'DEALER', label: 'Dealer' }] },
  ];
}
