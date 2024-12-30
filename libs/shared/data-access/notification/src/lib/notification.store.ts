import {
  patchState,
  signalStore,
  type,
  withHooks,
  withProps,
  withState,
} from '@ngrx/signals';
import { inject, resource } from '@angular/core';
import {
  IGetAuthenticatedUserNotificationsGQL,
  IGetAuthenticatedUserNotificationsQuery,
  INotificationCreatedTrackGQL,
} from './notification.generated';
import { setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withEntities({
    entity:
      type<
        NonNullable<
          NonNullable<
            NonNullable<
              IGetAuthenticatedUserNotificationsQuery['authenticatedUserNotifications']
            >['items']
          >[number]
        >
      >(),
    collection: 'searchedItems',
  }),
  withState({
    currentPage: 1,
    pageSize: 20,
  }),
  withProps(() => ({
    _getAuthenticatedUserNotificationsGQL: inject(
      IGetAuthenticatedUserNotificationsGQL
    ),
    _notificationCreatedTrackGQL: inject(INotificationCreatedTrackGQL),
  })),
  withProps((store) => ({
    _getAuthenticatedUserNotification: resource({
      request: () => ({
        pageSize: store.pageSize(),
        currentPage: store.currentPage(),
      }),
      loader: async ({ request }) => {
        const notifications = await store._getAuthenticatedUserNotificationsGQL
          .watch({ ...request })
          .result();
        const items =
          notifications.data.authenticatedUserNotifications?.items?.filter(
            (x) => x !== null
          );
        if (items) {
          patchState(
            store,
            setAllEntities(items, { collection: 'searchedItems' })
          );
        }
        return notifications;
      },
    }),
  })),
  withHooks((store) => {
    const onInit = () => {
      store._notificationCreatedTrackGQL.subscribe().subscribe({
        next: (res) => {
          if(res.data?.notificationCreated?.notification) {
            patchState(
              store,
              setEntity(res.data.notificationCreated.notification, { collection: 'searchedItems' })
            );
          }
        },
      });
    };

    return { onInit };
  })
);
