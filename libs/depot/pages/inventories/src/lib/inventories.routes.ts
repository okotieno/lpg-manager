import { Routes } from '@angular/router';

export const INVENTORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./inventories-page/inventories-page.component'),
    data: {
      routeLabel: 'Inventories',
      breadcrumbs: [{ label: 'Inventories' }],
    },
  },
  {
    path: 'view',
    loadComponent: () =>
      import('./view-inventory-page/view-inventory-page.component'),
    data: {
      routeLabel: 'View Inventory',
      breadcrumbs: [{ label: 'View Inventory' }],
    },
  },
];
