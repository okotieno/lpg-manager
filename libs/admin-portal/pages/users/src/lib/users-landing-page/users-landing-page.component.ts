import { Component } from '@angular/core';
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
  templateUrl: './users-landing-page.component.html',
  styles: `
    ion-icon {
      font-size: 100px;
    }
  `,
})
export default class UserTableComponent {}
