import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore, showAccessDeniedAlert } from '@lpg-manager/auth-store';
import { runGuardsInOrder } from '@lpg-manager/sequential-guards';

export const appRoutes: Route[] = [
  {
    path: '',
    canMatch: [() => inject(AuthStore).loadUserInfoGuard()],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canMatch: [() => !inject(AuthStore).isLoggedIn()],
        redirectTo: 'auth',
      },
      {
        path: '',
        pathMatch: 'full',
        canMatch: [() => inject(AuthStore).isLoggedIn()],
        redirectTo: 'dashboard',
      },
      {
        path: 'auth',
        canMatch: [() => inject(AuthStore).isLoggedIn()],
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        canMatch: [() => !inject(AuthStore).isLoggedIn()],
        redirectTo: 'auth',
      },
      {
        path: 'auth',
        loadChildren: () => import('@lpg-manager/auth-page'),
        canMatch: [() => !inject(AuthStore).isLoggedIn()],
      },
      {
        path: 'dashboard',
        loadChildren: () => import('@lpg-manager/dealer-dashboard-page'),
        canMatch: [
          () => inject(AuthStore).isLoggedIn(),
          () => inject(AuthStore).hasPermissionTo('access dealer app'),
        ],
      },
      {
        path: 'dashboard',
        canMatch: [
          () => inject(AuthStore).isLoggedIn(),
          runGuardsInOrder(
            () => !inject(AuthStore).hasPermissionTo('access dealer app'),
            () => showAccessDeniedAlert({ app: 'dealer app '})
          ),
        ],
        children: [],
      },
    ],
  },
];
