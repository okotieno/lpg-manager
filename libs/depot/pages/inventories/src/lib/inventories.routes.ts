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
    path: 'create',
    loadComponent: () =>
      import('./inventory-management/inventory-management.component'),
    data: {
      routeLabel: 'Inventories',
      breadcrumbs: [
        { label: 'Inventories' }
      ],
    },
  },
  // {
  //   path: 'view',
  //   loadComponent: () =>
  //     import('./view-inventory-page/view-inventory-page.component'),
  //   data: {
  //     routeLabel: 'View Inventory',
  //     breadcrumbs: [{ label: 'View Inventory' }],
  //   },
  // },

  {
    path: 'changes/:inventoryChangeId',
    loadComponent: () =>
      import('./view-inventory-change-page/view-inventory-change-page.component'),
    data: {
      routeLabel: 'View Inventory',
      breadcrumbs: [{ label: 'View Inventory' }],
    },
  },
];
