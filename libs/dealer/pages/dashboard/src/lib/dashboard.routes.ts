import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-page/dashboard-page.component'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home-page/home-page.component'),
      },
      {
        path: 'catalogues',
        loadChildren: () => import('@lpg-manager/dealer-catalogues-page'),
      },
    ],
  },
];
