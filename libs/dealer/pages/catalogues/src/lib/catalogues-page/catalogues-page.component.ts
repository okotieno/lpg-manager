import { Component, inject } from '@angular/core';
import { CataloguesStore } from '@lpg-manager/catalogue-store';
import { PaginatedResource } from '@lpg-manager/data-table';
import { ICatalogueModel } from '@lpg-manager/types';
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lpg-catalogues',
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonImg,
    CurrencyPipe,
  ],
  templateUrl: './catalogues-page.component.html',
  providers: [CataloguesStore],
})
export default class CataloguesPageComponent {
  cataloguesStore = inject(
    CataloguesStore
  ) as PaginatedResource<ICatalogueModel>;
  catalogues = this.cataloguesStore.items;
}
