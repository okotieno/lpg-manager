import {
  Component,
  computed,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPopover,
} from '@ionic/angular/standalone';
import { NotificationStore } from '@lpg-manager/notification-store';
import { DatePipe } from '@angular/common';
import { IQueryOperatorEnum } from '@lpg-manager/types';

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
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonContent,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationBellComponent {
  private ionInfiniteScroll = viewChild(IonInfiniteScroll);
  #notificationStore = inject(NotificationStore);
  notificationsLoadingEffect = effect(async () => {
    const isLoading = this.#notificationStore.isLoading();
    await untracked(async () => {
      if (!isLoading) {
        await this.ionInfiniteScroll()?.complete();
      }
    });
  });

  notificationStats = this.#notificationStore.notificationStats;
  notifications = computed(() =>
    this.#notificationStore
      .searchedItemsEntities()
      .sort(
        ({ createdAt: a }, { createdAt: b }) =>
          new Date(b).getTime() - new Date(a).getTime()
      )
  );

  showInfiniteScroll = computed(() => {
    console.log(
      this.#notificationStore.totalItems(),
      this.#notificationStore.searchedItemsEntities().length
    );

    return (
      this.#notificationStore.totalItems() >
      this.#notificationStore.searchedItemsEntities().length
    );
  });

  constructor() {
    this.#notificationStore.setFilters([
      {
        field: 'isRead',
        operator: IQueryOperatorEnum.Equals,
        value: 'false',
        values: [],
      },
    ]);
  }

  markAsRead(notificationId: string) {
    this.#notificationStore.markAsRead(notificationId);
  }

  handleInfiniteScroll() {
    this.#notificationStore.loadNextPage();
  }
}
