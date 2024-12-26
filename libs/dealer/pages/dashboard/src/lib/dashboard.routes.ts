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
      () => inject(AuthStore).isLoggedIn()
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
        path: 'catalogues',
        loadChildren: () => import('@lpg-manager/dealer-catalogues-page'),
      },
    ],
  },
  {
    path: '**',
    canMatch: [
      () => !inject(AuthStore).isLoggedIn()
    ],
    redirectTo: '/login'
  }
];
