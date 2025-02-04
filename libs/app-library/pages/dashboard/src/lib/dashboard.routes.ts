import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-page/dashboard-page.component'),
    data: {
      routeLabel: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard' }],
    },
    children: [
      {
        path: '',
        loadChildren: () => import('@lpg-manager/home-page'),
        pathMatch: 'full'
      }
    ],
  },
];
