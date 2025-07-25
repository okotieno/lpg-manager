import { Component, computed, effect, inject, untracked } from '@angular/core';
import { OrderStore } from '@lpg-manager/order-store';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBadge, IonButton,
  IonContent, IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonText
} from '@ionic/angular/standalone';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IConsolidatedOrderStatus, IOrderDispatchStatus, IQueryOperatorEnum } from '@lpg-manager/types';
import { AuthStore } from '@lpg-manager/auth-store';
import { GET_ITEMS_INCLUDE_FIELDS } from '@lpg-manager/data-table';
import { RouterLink } from '@angular/router';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';

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
    IonButton,
    RouterLink,
    UUIDDirective,
    IonIcon,
  ],
  providers: [
    OrderStore,
    {
      provide: GET_ITEMS_INCLUDE_FIELDS,
      useValue: {
        includeDispatch: true,
        includeConsolidatedOrder: true,
      },
    },
  ],
})
export default class OrdersPageComponent {
  #orderStore = inject(OrderStore);
  #authStore = inject(AuthStore);
  driverToDealerConfirmed = IOrderDispatchStatus.DriverToDealerConfirmed;
  orders = computed(() => this.#orderStore.searchedItemsEntities() || []);
  ordersDisplayed = computed(() =>
    this.orders().map((order) => ({
      ...order,
      color: this.getStatusColor(order.status),
      varColor: `var(--ion-color-${this.getStatusColor(order.status)})`,
      varColorLight: `rgba(var(--ion-color-${this.getStatusColor(
        order.status
      )}-rgb), 0.05)`,
    }))
  );
  activeStationId = computed(() => this.#authStore.activeStation()?.id);
  activeStationChangeEffect = effect(() => {
    const activeStationId = this.activeStationId();
    untracked(() => {
      if (activeStationId) {
        this.#orderStore.setFilters([
          {
            field: 'dealerId',
            operator: IQueryOperatorEnum.Equals,
            value: activeStationId,
            values: [],
          },
        ]);
      }
    });
  });

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'medium';
    }
  }

  protected readonly IConsolidatedOrderStatus = IConsolidatedOrderStatus;
}
