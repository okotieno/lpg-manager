import { Component, computed, inject } from '@angular/core';
import { OrderStore } from '@lpg-manager/order-store';
import {
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonIcon,
  IonText,
  IonItemDivider
} from '@ionic/angular/standalone';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lpg-orders',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonContent,
    IonAccordionGroup,
    IonAccordion,
    IonIcon,
    IonText,
    DatePipe,
    CurrencyPipe,
    IonItemDivider,
  ],
})
export default class OrdersPageComponent {
  #orderStore = inject(OrderStore);

  orders = computed(() => this.#orderStore.searchedItemsEntities() || []);

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'CANCELED':
        return 'danger';
      default:
        return 'medium';
    }
  }
}
