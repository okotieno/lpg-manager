import { Component, computed, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { IBrandModel } from '@lpg-manager/types';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'lpg-brand-page',
  standalone: true,
  imports: [
    IonText,
    TitleCasePipe,
    IonIcon,
    IonRow,
    IonGrid,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
  ],
  templateUrl: './brand-page.component.html',
  styles: `
    .details-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      gap: 0.5rem;
    }

    .no-catalogues {
      color: var(--ion-color-medium);
      font-style: italic;
    }
  `,
})
export default class BrandPageComponent {
  brand = input<IBrandModel>();

  hasCatalogues = computed(() => {
    return (
      this.brand()?.catalogues && Number(this.brand()?.catalogues?.length) > 0
    );
  });
}
