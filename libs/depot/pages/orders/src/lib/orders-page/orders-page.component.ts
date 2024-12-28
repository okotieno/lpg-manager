import { Component, inject } from '@angular/core';
import { OrderStore } from '@lpg-manager/order-store';

@Component({
  selector: 'lpg-orders',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
})
export default class OrdersPageComponent {
  #orderStore = inject(OrderStore);

  get orders() {
    return this.#orderStore.orders;
  }
} 