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
  IonText,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { DatePipe, CurrencyPipe, JsonPipe } from '@angular/common';

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
    IonText,
    DatePipe,
    CurrencyPipe,
    IonItemDivider,
    JsonPipe,
  ],
  providers: [OrderStore],
})
export default class OrdersPageComponent {
  #orderStore = inject(OrderStore);

  orders = computed(() => this.#orderStore.searchedItemsEntities() || []);
  ordersDisplayed = computed(() =>
    this.orders().map((order) => ({
      ...order,
      color: this.getStatusColor(order.status),
      varColor: `var(--ion-color-${this.getStatusColor(order.status)})`
    }))
  );

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
