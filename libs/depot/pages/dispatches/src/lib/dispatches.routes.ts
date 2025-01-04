import { Routes } from '@angular/router';

export const DISPATCHES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dispatches/dispatches-page.component'),
    data: {
      routeLabel: 'Operations',
      breadcrumbs: [
        { label: 'Operations', path: ['/dashboard', 'operations'] },
        { label: 'Dispatches' },
      ],
    },
  },
  {
    path: 'create',
    loadComponent: () => import('./create-dispatch/create-dispatch.component'),
    data: {
      routeLabel: 'Create Dispatch',
      breadcrumbs: [
        { label: 'Operations', path: ['/dashboard', 'operations'] },
        { label: 'Dispatches', path: ['/dashboard', 'operations', 'dispatches'] },
        { label: 'Create Dispatch' },
      ],
    },
  },
];
