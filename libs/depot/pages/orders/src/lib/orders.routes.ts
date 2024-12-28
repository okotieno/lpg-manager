import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@lpg-manager/auth-store';
import { map } from 'rxjs';

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
