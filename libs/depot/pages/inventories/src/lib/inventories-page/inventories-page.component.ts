import { Component, inject } from '@angular/core';
import { OrderStore } from '@lpg-manager/order-store';

@Component({
  selector: 'lpg-inventories',
  templateUrl: './inventories-page.component.html',
  styleUrls: ['./inventories-page.component.scss'],
})
export default class InventoriesPageComponent {
  #orderStore = inject(OrderStore);

  get orders() {
    return this.#orderStore.orders;
  }
}
