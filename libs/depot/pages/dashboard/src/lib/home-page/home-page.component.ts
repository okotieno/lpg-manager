import {
  Component,
  signal,
  inject,
  input,
  effect,
  untracked,
} from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { OrderStore } from '@lpg-manager/order-store';
import { IOrderStatus, IQueryOperatorEnum } from '@lpg-manager/types';

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
  providers: [OrderStore],
})
export default class HomePageComponent {
  #orderStore = inject(OrderStore);

  pendingOrderStatus = IOrderStatus.Pending;
  completedOrderStatus = IOrderStatus.Completed;

  pendingOrders = signal(0);
  completedOrders = signal(0);

  constructor() {
    this.loadStats();
  }

  async loadStats() {
    try {
      const stats = await this.#orderStore.getOrderStats();
      if (stats) {
        this.pendingOrders.set(stats.pendingOrders);
        this.completedOrders.set(stats.completedOrders);
      }
    } catch (error) {
      console.error('Error loading order stats:', error);
    }
  }
}
