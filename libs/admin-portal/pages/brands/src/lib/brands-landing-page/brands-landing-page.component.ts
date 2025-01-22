import { Component, inject } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { BrandStore } from '@lpg-manager/brand-store';
import {
  DataTableComponent,
  ITableColumn,
  PaginatedResource,
} from '@lpg-manager/data-table';
import { IBrandModel } from '@lpg-manager/types';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-brands-page',
  standalone: true,
  imports: [CdkTableModule, DataTableComponent, IonContent],
  template: `
    <ion-content class="ion-padding">
      <lpg-data-table
        createNewIcon="shield-plus"
        [store]="brandsStore"
        [columns]="allColumns"
      ></lpg-data-table>
    </ion-content>

  `,
  providers: [BrandStore],
})
export default class BrandsLandingPageComponent {
  brandsStore = inject(BrandStore) as PaginatedResource<IBrandModel>;
  protected readonly allColumns: ITableColumn<IBrandModel>[] = [
    { label: 'ID', key: 'id', fieldType: 'uuid' },
    { label: 'Name', key: 'name', fieldType: 'string' },
  ];
}
