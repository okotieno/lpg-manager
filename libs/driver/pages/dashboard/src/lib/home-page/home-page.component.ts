import { Component, computed, inject, signal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { DispatchStore } from '@lpg-manager/dispatch-store';
import { IDispatchStatus, IQueryOperatorEnum } from '@lpg-manager/types';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';
import { AuthStore } from '@lpg-manager/auth-store';

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
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonButtons,
    UUIDDirective,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers: [DispatchStore],
})
export default class DashboardComponent {
  #dispatchStore = inject(DispatchStore);
  #authStore = inject(AuthStore);
  pendingOrders = signal(5); // This would come from a service
  completedOrders = signal(12); // This would come from a service
  dispatchStatus = IDispatchStatus;
  driverId = computed(() => this.#authStore.activeRole()?.driver?.id as string);

  dispatchesFromDealer = this.#dispatchStore.searchedItemsEntities;

  constructor() {
    console.log();
    this.#dispatchStore.setFilters([
      {
        field: 'driverId',
        operator: IQueryOperatorEnum.Equals,
        value: this.driverId(),
        values: [],
      },
      {
        field: 'status',
        operator: IQueryOperatorEnum.In,
        value: '',
        values: [
          IDispatchStatus.InTransit,
          IDispatchStatus.Initiated,
          IDispatchStatus.Delivering,
        ],
      },
    ]);
  }
}
