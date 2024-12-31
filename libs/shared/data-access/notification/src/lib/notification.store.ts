import {
  patchState,
  signalStore,
  type,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import {
  IGetAuthenticatedUserNotificationsGQL,
  IGetAuthenticatedUserNotificationsQuery,
  IGetAuthenticatedUserNotificationStatsGQL,
  IMarkNotificationAsReadGQL,
  INotificationCreatedTrackGQL,
} from './notification.generated';
import {
  removeEntity,
  setAllEntities,
  setEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY, tap } from 'rxjs';

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
    notificationStats: {
      unread: 0,
      total: 0,
      read: 0,
    },
    readNotificationId: '',
  }),
  withProps(() => ({
    _getAuthenticatedUserNotificationsGQL: inject(
      IGetAuthenticatedUserNotificationsGQL
    ),
    _notificationCreatedTrackGQL: inject(INotificationCreatedTrackGQL),
    _getAuthenticatedUserNotificationStatsGQL: inject(
      IGetAuthenticatedUserNotificationStatsGQL
    ),
    _markAsReadGQL: inject(IMarkNotificationAsReadGQL),
  })),
  withProps((store) => ({
    _markAsReadResource: rxResource({
      request: () => ({ notificationId: store.readNotificationId() }),
      loader: ({ request }) => {
        if (!request.notificationId) {
          return EMPTY;
        }
        return store._markAsReadGQL
          .mutate({ notifications: [{ id: request.notificationId }] })
          .pipe(
            tap((res) => {
              const responseData = res.data?.markNotificationAsRead?.data;
              if (responseData) {
                patchState(
                  store,
                  {
                    notificationStats: { ...responseData },
                  },
                  removeEntity(request.notificationId, {
                    collection: 'searchedItems',
                  })
                );
              }
            })
          );
      },
    }),
    _getAuthenticatedUserNotificationStats: resource({
      loader: async () => {
        const notificationStats =
          await store._getAuthenticatedUserNotificationStatsGQL
            .watch()
            .result();
        const total =
          notificationStats.data.authenticatedUserNotificationStats?.total ?? 0;
        const unread =
          notificationStats.data.authenticatedUserNotificationStats?.unread ??
          0;
        const read = total - unread;
        patchState(store, { notificationStats: { unread, total, read } });
      },
    }),
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
        if (items && store.currentPage() === 1) {
          patchState(
            store,
            setAllEntities(items, { collection: 'searchedItems' })
          );
        } else if (items) {
          patchState(
            store,
            setEntities(items, { collection: 'searchedItems' })
          );
        }
        return notifications;
      },
    }),
  })),
  withComputed((store) => ({
    isLoading: computed(
      () =>
        store._markAsReadResource.isLoading() ||
        store._getAuthenticatedUserNotification.isLoading()
    ),
  })),
  withMethods((store) => ({
    markAsRead: (readNotificationId: string) => {
      patchState(store, { readNotificationId });
    },
    loadNextPage: () => {
      patchState(store, { currentPage: store.currentPage() + 1 });
    },
  })),
  withHooks((store) => {
    const onInit = () => {
      store._notificationCreatedTrackGQL.subscribe().subscribe({
        next: (res) => {
          if (res.data?.notificationCreated?.notification) {
            patchState(
              store,
              setEntity(res.data.notificationCreated.notification, {
                collection: 'searchedItems',
              })
            );
          }
        },
      });
    };

    return { onInit };
  })
);
