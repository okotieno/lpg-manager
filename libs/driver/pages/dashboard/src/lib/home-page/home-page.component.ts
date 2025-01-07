import { Component, inject, signal } from '@angular/core';
import {
  IonBadge, IonButton, IonButtons,
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
import { JsonPipe } from '@angular/common';
import { IDispatchStatus, IQueryOperatorEnum } from '@lpg-manager/types';

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
    JsonPipe,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonBadge,
    IonButton,
    IonButtons,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers: [DispatchStore],
})
export default class DashboardComponent {
  #dispatchStore = inject(DispatchStore);
  pendingOrders = signal(5); // This would come from a service
  completedOrders = signal(12); // This would come from a service

  dispatchesFromDealer = this.#dispatchStore.searchedItemsEntities;
  constructor() {
    this.#dispatchStore.setFilters([
      {
        field: 'status',
        operator: IQueryOperatorEnum.In,
        value: '',
        values: [IDispatchStatus.DepotToDriverConfirmed],
      },
    ]);
  }
}
