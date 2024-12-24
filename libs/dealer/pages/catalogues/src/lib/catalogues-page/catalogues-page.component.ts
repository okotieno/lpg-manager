import { Component, inject } from '@angular/core';
import { CataloguesStore } from '@lpg-manager/catalogue-store';
import { PaginatedResource } from '@lpg-manager/data-table';
import { ICatalogueModel } from '@lpg-manager/types';
import {
  IonButton,
  IonCard,
  IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonCol,
  IonGrid, IonIcon,
  IonImg,
  IonRow, IonSearchbar,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';
import { CartStore } from '@lpg-manager/cart-store';
import { AddToCartDialogComponent } from '@lpg-manager/cart-store';

@Component({
  selector: 'lpg-catalogues',
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonText,
    IonImg,
    CurrencyPipe,
    IonSearchbar,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
    IonButton,
  ],
  templateUrl: './catalogues-page.component.html',
  styleUrl: './catalogues-page.component.scss',
  providers: [CataloguesStore],
})
export default class CataloguesPageComponent {

  #cartStore = inject(CartStore);
  #modalCtrl = inject(ModalController);


  cataloguesStore = inject(
    CataloguesStore
  ) as unknown as PaginatedResource<ICatalogueModel>;
  catalogues = this.cataloguesStore.items;

  handleSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    // Implement search functionality through your store
    this.cataloguesStore.setSearchTerm(searchTerm);
  }

  async addToCart(catalogue: ICatalogueModel) {
    const modal = await this.#modalCtrl.create({
      component: AddToCartDialogComponent,
      componentProps: {
        catalogue,
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
       this.#cartStore.addItem(data.catalogueId, data.quantity);
    }
  }
}
