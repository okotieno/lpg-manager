import {
  patchState,
  signalStore,
  type,
  withProps,
  withState,
} from '@ngrx/signals';
import { inject, resource } from '@angular/core';
import {
  IGetAuthenticatedUserNotificationsGQL,
  IGetAuthenticatedUserNotificationsQuery,
} from './notification.generated';
import {
  addEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';

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
  }))
);
