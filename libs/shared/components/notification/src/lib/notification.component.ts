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

  markAsRead(notificationId: string) {
    this.#notificationStore.markAsRead(notificationId);
  }

  showInfiniteScroll = computed(() => {
    return true;
  });

  handleInfiniteScroll() {
    this.#notificationStore.loadNextPage();
  }
}
