import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { BrandsStore } from '@lpg-manager/brand-store';
import { DataTableComponent, ITableColumn } from '@lpg-manager/data-table';
import { PaginatedResource } from '@lpg-manager/data-table';
import { IBrandModel } from '@lpg-manager/types';

@Component({
  selector: 'lpg-brands-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent],
  template: `<lpg-data-table
    pageTitle="Brands"
    createNewIcon="shield-plus"
    [store]="brandsStore"
    [columns]="allColumns"
  ></lpg-data-table>`,
  providers: [BrandsStore],
})
export default class BrandsLandingPageComponent {
  brandsStore = inject(BrandsStore) as PaginatedResource<IBrandModel>;
  protected readonly allColumns: ITableColumn<IBrandModel>[] = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
  ];
}
