import { Component, computed, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { IRoleModel } from '@lpg-manager/types';
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
    IonChip
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

    .permissions-container {
      padding: 1rem 0;
    }

    .permissions-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .no-permissions {
      color: var(--ion-color-medium);
      font-style: italic;
    }
  `,
})
export default class BrandPageComponent {
  role = input<IRoleModel>();

  hasPermissions = computed(() => {
    return this.role()?.permissions && Number(this.role()?.permissions?.length) > 0;
  });
}
