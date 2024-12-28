import { Routes } from '@angular/router';

export const INVENTORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./inventories-page/inventories-page.component'),
    data: {
      routeLabel: 'Orders',
      breadcrumbs: [{ label: 'Orders' }],
    },
  }
];
