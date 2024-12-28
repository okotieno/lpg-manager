import { Component, signal } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader, IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lpg-home-page',
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    RouterLink,
    IonIcon,
    IonText,
    IonCardHeader,
    IonCardTitle,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export default class DashboardComponent {
  pendingOrders = signal(5); // This would come from a service
  completedOrders = signal(12); // This would come from a service
}
