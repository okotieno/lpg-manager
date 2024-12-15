import { Routes } from '@angular/router';

export const ADMINISTRATION_ROUTES:Routes = [
  {
    path: '',
    loadComponent: () => import('./administration-landing-page/administration-landing-page.component'),
    pathMatch: 'full',
    data: {
      routeLabel: "Administration"
    }
  }
]
