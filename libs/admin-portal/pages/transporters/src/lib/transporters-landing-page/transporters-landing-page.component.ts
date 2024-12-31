import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { TransporterStore } from '@lpg-manager/transporter-store';
import { DataTableComponent, ITableColumn } from '@lpg-manager/data-table';
import { PaginatedResource } from '@lpg-manager/data-table';
import { ITransporterModel } from '@lpg-manager/types';

@Component({
  selector: 'lpg-transporters-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent],
  template: `<lpg-data-table
    createNewIcon="plus"
    [store]="transporterStore"
    [columns]="allColumns"
  ></lpg-data-table>`,
  providers: [TransporterStore],
})
export default class TransportersLandingPageComponent {
  transporterStore = inject(TransporterStore) as PaginatedResource<ITransporterModel>;
  protected readonly allColumns: ITableColumn<ITransporterModel>[] = [
    { label: 'ID', key: 'id', fieldType: 'uuid' },
    { label: 'Name', key: 'name', fieldType: 'string' },
  ];
}
