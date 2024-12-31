import { Routes } from '@angular/router';

export const ADMINISTRATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './administration-landing-page/administration-landing-page.component'
      ),
    pathMatch: 'full',
    data: {
      routeLabel: 'Administration',
      breadcrumbs: [{ label: 'Administration' }],
    },
  },
  {
    path: 'brands',
    loadChildren: () => import('@lpg-manager/brands-page'),
    data: {
      routeLabel: 'Brands',
    },
  },
  {
    path: 'stations',
    loadChildren: () => import('@lpg-manager/stations-page'),
    data: {
      routeLabel: 'Stations',
      breadcrumbs: [{ label: 'Stations' }],
    },
  },
  {
    path: 'transporters',
    loadChildren: () => import('@lpg-manager/transporters-page'),
    data: {
      routeLabel: 'Transporters',
      breadcrumbs: [{ label: 'Transporters' }],
    },
  },
];
