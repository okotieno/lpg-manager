import { Component, inject, signal } from '@angular/core';
import {
  IonButton, IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon, IonItem, IonLabel, IonList, IonListHeader,
  IonRow,
  IonText
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { DispatchStore } from '@lpg-manager/dispatch-store';
import { IDispatchStatus, IQueryOperatorEnum } from '@lpg-manager/types';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';

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
  pendingOrders = signal(5); // This would come from a service
  completedOrders = signal(12); // This would come from a service
  dispatchStatus = IDispatchStatus;

  dispatchesFromDealer = this.#dispatchStore.searchedItemsEntities;
  constructor() {
    this.#dispatchStore.setFilters([
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
