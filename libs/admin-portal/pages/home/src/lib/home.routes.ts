import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home-page/home-page.component'),
    data: {
      routeLabel: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard' }],
    },
  },
];
