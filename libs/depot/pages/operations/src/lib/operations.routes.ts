import { Routes } from '@angular/router';

export const OPERATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./operations-page/operations-page.component'),
    data: {
      routeLabel: 'Operations',
      breadcrumbs: [{ label: 'Operations' }],
    },
  },
  {
    path: 'dispatches',
    loadChildren: () => import('@lpg-manager/depot-dispatches-page'),
    data: {
      routeLabel: 'Operations',
      breadcrumbs: [{ label: 'Operations' }],
    },
  },
];

