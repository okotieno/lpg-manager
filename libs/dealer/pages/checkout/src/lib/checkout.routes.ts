import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./checkout-page/checkout-page.component'),
    data: {
      routeLabel: 'Checkout',
      breadcrumbs: [{ label: 'Checkout' }],
    },
  },
];
