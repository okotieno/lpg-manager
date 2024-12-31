import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@lpg-manager/auth-store';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-page/dashboard-page.component'),
    data: {
      routeLabel: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard' }],
    },
    canMatch: [
      () => inject(AuthStore).isAuthenticatedGuard()
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home-page/home-page.component'),
        data: {
          routeLabel: 'Dashboard',
          breadcrumbs: [{ label: 'Dashboard' }],
        }
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('@lpg-manager/profile-page'),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('@lpg-manager/depot-orders-page'),
      },
      {
        path: 'inventories',
        loadChildren: () =>
          import('@lpg-manager/depot-inventories-page'),
      },
      {
        path: 'operations',
        loadChildren: () =>
          import('@lpg-manager/depot-operations-page'),
      },
    ],
  }
];
