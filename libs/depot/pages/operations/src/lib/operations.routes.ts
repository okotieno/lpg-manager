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
    path: 'create',
    loadComponent: () => import('./create-dispatch/create-dispatch.component'),
    data: {
      routeLabel: 'Create Dispatch',
      breadcrumbs: [
        { label: 'Operations', path: ['/dashboard', 'operations'] },
        { label: 'Create Dispatch' },
      ],
    },
  },
];
