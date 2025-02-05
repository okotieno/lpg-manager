import {
  Component,
  computed,
  effect,
  inject,
  input,
  Signal,
  untracked,
} from '@angular/core';
import { OrderStore } from '@lpg-manager/order-store';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBadge,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  IOrderStatus,
  IQueryOperatorEnum,
  IQueryParamsFilter,
} from '@lpg-manager/types';
import { AuthStore } from '@lpg-manager/auth-store';
import { GET_ITEMS_INCLUDE_FIELDS } from '@lpg-manager/data-table';
import { ConfirmDispatchModalComponent } from '../components/confirm-dispatch-modal.component';
import { RejectOrderModalComponent } from '../components/reject-order-modal.component';

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
    IonRow,
    IonButtons,
    IonCol,
  ],
  providers: [
    OrderStore,
    {
      provide: GET_ITEMS_INCLUDE_FIELDS,
      useValue: {
        includeDealer: true,
      },
    },
  ],
})
export default class OrdersPageComponent {
  #orderStore = inject(OrderStore);
  #authStore = inject(AuthStore);
  #modalCtrl = inject(ModalController);
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

  status = input<IOrderStatus>();

  statusFilter: Signal<IQueryParamsFilter[]> = computed(() => {
    const status = this.status();
    if (status) {
      return [
        {
          field: 'status',
          operator: IQueryOperatorEnum.Equals,
          value: status,
        },
      ];
    } else {
      return [];
    }
  });
  activeStationId = computed(() => this.#authStore.activeStation()?.id);
  activeStationChangeEffect = effect(() => {
    const statusFilter = this.statusFilter();
    const activeStationId = this.activeStationId();
    untracked(() => {
      if (activeStationId) {
        this.#orderStore.setFilters([
          ...statusFilter,
          {
            field: 'depotId',
            operator: IQueryOperatorEnum.Equals,
            value: activeStationId,
            values: [],
          },
        ]);
      } else {
        this.#orderStore.setFilters([]);
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
      case 'REJECTED':
        return 'danger';
      default:
        return 'medium';
    }
  }

  async confirmDispatch(order: any) {
    const modal = await this.#modalCtrl.create({
      component: ConfirmDispatchModalComponent,
      componentProps: {
        order: order,
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      await this.#orderStore.updateOrderStatus(
        order.id,
        IOrderStatus.Confirmed
      );
    }
  }

  async rejectOrder(order: any) {
    const modal = await this.#modalCtrl.create({
      component: RejectOrderModalComponent,
      componentProps: {
        order: order,
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      await this.#orderStore.updateOrderStatus(order.id, IOrderStatus.Rejected);
    }
  }
}
