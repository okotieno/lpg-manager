import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonItem, IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPopover
} from '@ionic/angular/standalone';
import { NotificationStore } from '@lpg-manager/notification-store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lpg-notification-bell',
  imports: [
    IonIcon,
    IonButton,
    IonList,
    IonPopover,
    IonItem,
    IonLabel,
    DatePipe,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationBellComponent {
  #notificationStore = inject(NotificationStore);
  notifications = this.#notificationStore.searchedItemsEntities;
}
