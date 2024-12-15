import { Component, inject, input, signal } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow, IonText
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { IGetUserCountGQL } from '@lpg-manager/user-store';

@Component({
  selector: 'lpg-user-table',
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon,
    IonCardHeader,
    IonCardTitle,
    RouterLink,
    IonText,
  ],
  templateUrl: './administration-landing-page.component.html',
  styles: `
    ion-icon {
      font-size: 100px;
    }
  `,
})
export default class UserTableComponent {
  private getUserCountGQL = inject(IGetUserCountGQL);
  brandCount = signal(0);

  constructor() {
    this.loadUserCount();
  }

  loadUserCount() {
    this.getUserCountGQL.fetch().subscribe((response) => {
      if (response.data?.userCount) {
        this.brandCount.set(response.data.userCount.count);
      }
    });
  }
}
