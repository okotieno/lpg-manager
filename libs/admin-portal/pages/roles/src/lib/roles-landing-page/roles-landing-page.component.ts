import { Component } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lpg-roles-page',
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
  template: `
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <h1>Roles Management</h1>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: `
    ion-icon {
      font-size: 100px;
    }
  `,
})
export default class RolesLandingPageComponent {} 