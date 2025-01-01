import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import {
  IGetTransportersQuery,
  TransporterStore,
} from '@lpg-manager/transporter-store';
import { DataTableComponent, ITableColumn } from '@lpg-manager/data-table';
import { PaginatedResource } from '@lpg-manager/data-table';

@Component({
  selector: 'lpg-transporters-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent],
  template: ` <lpg-data-table
    createNewIcon="plus"
    [store]="transporterStore"
    [columns]="allColumns"
  ></lpg-data-table>`,
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
