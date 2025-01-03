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
        path: 'catalogues',
        loadChildren: () => import('@lpg-manager/dealer-catalogues-page'),
      },
      {
        path: 'checkout',
        loadChildren: () => import('@lpg-manager/checkout-page'),
        data: {
          routeLabel: 'Checkout',
          breadcrumbs: [{ label: 'Checkout' }],
        },
      },
      {
        path: 'profile',
        loadChildren: () => import('@lpg-manager/profile-page'),
      },
      {
        path: 'orders',
        loadChildren: () => import('@lpg-manager/dealer-orders-page'),
      },
    ],
  },
];
