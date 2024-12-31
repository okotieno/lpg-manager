import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type INotificationItemFragment = { id: string, description: string, createdAt: string, title: string, isRead: boolean };

export type IGetAuthenticatedUserNotificationsQueryVariables = Types.Exact<{
  pageSize: Types.Scalars['Int']['input'];
  currentPage: Types.Scalars['Int']['input'];
  filters?: Types.InputMaybe<Array<Types.InputMaybe<Types.IQueryParamsFilter>> | Types.InputMaybe<Types.IQueryParamsFilter>>;
}>;


export type IGetAuthenticatedUserNotificationsQuery = { authenticatedUserNotifications?: { items?: Array<{ id: string, description: string, createdAt: string, title: string, isRead: boolean } | null> | null, meta?: { totalItems: number } | null } | null };

export type IGetAuthenticatedUserNotificationStatsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type IGetAuthenticatedUserNotificationStatsQuery = { authenticatedUserNotificationStats?: { unread: number, read: number, total: number } | null };

export type IMarkNotificationAsReadMutationVariables = Types.Exact<{
  notifications: Array<Types.ISelectCategory> | Types.ISelectCategory;
}>;


export type IMarkNotificationAsReadMutation = { markNotificationAsRead?: { message?: string | null, data?: { read: number, unread: number, total: number } | null } | null };

export type INotificationCreatedTrackSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type INotificationCreatedTrackSubscription = { notificationCreated?: { notification?: { id: string, description: string, createdAt: string, title: string, isRead: boolean } | null, stats?: { unread: number, read: number, total: number } | null } | null };

export const NotificationItemFragmentDoc = gql`
    fragment notificationItem on NotificationUserModel {
  id
  description
  createdAt
  title
  isRead
}
    `;
export const GetAuthenticatedUserNotificationsDocument = gql`
    query GetAuthenticatedUserNotifications($pageSize: Int!, $currentPage: Int!, $filters: [QueryParamsFilter]) {
  authenticatedUserNotifications(
    query: {sortBy: "createdAt", sortByDirection: DESC, pageSize: $pageSize, currentPage: $currentPage, filters: $filters}
  ) {
    items {
      ...notificationItem
    }
    meta {
      totalItems
    }
  }
}
    ${NotificationItemFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetAuthenticatedUserNotificationsGQL extends Apollo.Query<IGetAuthenticatedUserNotificationsQuery, IGetAuthenticatedUserNotificationsQueryVariables> {
    override document = GetAuthenticatedUserNotificationsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAuthenticatedUserNotificationStatsDocument = gql`
    query GetAuthenticatedUserNotificationStats {
  authenticatedUserNotificationStats {
    unread
    read
    total
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetAuthenticatedUserNotificationStatsGQL extends Apollo.Query<IGetAuthenticatedUserNotificationStatsQuery, IGetAuthenticatedUserNotificationStatsQueryVariables> {
    override document = GetAuthenticatedUserNotificationStatsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MarkNotificationAsReadDocument = gql`
    mutation MarkNotificationAsRead($notifications: [SelectCategory!]!) {
  markNotificationAsRead(notifications: $notifications) {
    message
    data {
      read
      unread
      total
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IMarkNotificationAsReadGQL extends Apollo.Mutation<IMarkNotificationAsReadMutation, IMarkNotificationAsReadMutationVariables> {
    override document = MarkNotificationAsReadDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const NotificationCreatedTrackDocument = gql`
    subscription NotificationCreatedTrack {
  notificationCreated {
    notification {
      ...notificationItem
    }
    stats {
      unread
      read
      total
    }
  }
}
    ${NotificationItemFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class INotificationCreatedTrackGQL extends Apollo.Subscription<INotificationCreatedTrackSubscription, INotificationCreatedTrackSubscriptionVariables> {
    override document = NotificationCreatedTrackDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }