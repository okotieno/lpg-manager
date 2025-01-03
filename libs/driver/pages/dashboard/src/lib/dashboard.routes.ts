import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-page/dashboard-page.component'),
    data: {
      routeLabel: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard' }],
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home-page/home-page.component'),
        data: {
          routeLabel: 'Dashboard',
          breadcrumbs: [{ label: 'Dashboard' }],
        },
      },
      {
        path: 'profile',
        loadChildren: () => import('@lpg-manager/profile-page'),
      },
      {
        path: 'orders',
        loadChildren: () => import('@lpg-manager/driver-orders-page'),
      },
      {
        path: 'inventories',
        loadChildren: () => import('@lpg-manager/driver-inventories-page'),
      },
    ],
  },
];
