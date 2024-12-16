import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { BrandsStore } from '@lpg-manager/brand-store';
import { DataTableComponent } from '@lpg-manager/data-table';
import { PaginatedResource } from '@lpg-manager/searchable-select';

@Component({
  selector: 'lpg-brands-page',
  standalone: true,
  imports: [
    CdkTableModule,
    DataTableComponent,
  ],
  template: `<lpg-data-table
    pageTitle="Brands"
    createNewIcon="shield-plus"
    [store]="brandsStore"
    [displayedColumns]="displayedColumns"
  ></lpg-data-table>`,
  providers: [BrandsStore],
})
export default class BrandsLandingPageComponent {
  brandsStore = inject(BrandsStore) as PaginatedResource<any>;
  displayedColumns = ['name', 'actions'];
}
