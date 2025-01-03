import { Component, computed, input } from '@angular/core';
import {
  IonButton,
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
import { IUserModel } from '@lpg-manager/types';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lpg-user-page',
  standalone: true,
  imports: [
    IonText,
    TitleCasePipe,
    DatePipe,
    IonIcon,
    IonRow,
    IonGrid,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonButton,
    RouterLink,
  ],
  templateUrl: './user-page.component.html',
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

    .roles-container {
      padding: 1rem 0;
    }

    .roles-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .no-roles {
      color: var(--ion-color-medium);
      font-style: italic;
    }
  `,
})
export default class UserPageComponent {
  user = input<IUserModel>();

  hasRoles = computed(() => {
    return this.user()?.roles && Number(this.user()?.roles?.length) > 0;
  });
}
