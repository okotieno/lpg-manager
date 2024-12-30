import { signalStore, type, withProps, withState } from '@ngrx/signals';
import { inject, resource } from '@angular/core';
import {
  IGetAuthenticatedUserNotificationsGQL,
  IGetAuthenticatedUserNotificationsQuery,
} from './notification.generated';
import { withEntities } from '@ngrx/signals/entities';

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withEntities({
    entity:
      type<
        NonNullable<
          NonNullable<
            IGetAuthenticatedUserNotificationsQuery['authenticatedUserNotifications']
          >['items']
        >
      >(),
    collection: 'searchedItems',
  }),
  withState({}),
  withProps(() => ({
    _getAuthenticatedUserNotificationsGQL: inject(
      IGetAuthenticatedUserNotificationsGQL
    ),
  })),
  withProps((store) => ({
    _getAuthenticatedUserNotification: resource({
      loader: () => {
        const notifications = store._getAuthenticatedUserNotificationsGQL
          .watch()
          .result();
        console.log({ notifications });
        return notifications;
      },
    }),
  }))
);
