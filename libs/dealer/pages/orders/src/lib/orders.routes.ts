import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders-page/orders-page.component'),
    data: {
      routeLabel: 'Orders',
      breadcrumbs: [{ label: 'Orders' }],
    },
  }
];
