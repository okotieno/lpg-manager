import { Routes } from '@angular/router';

export const CATALOGUES_ROUTES:Routes = [
  {
    path: '',
    loadComponent: () => import('./catalogues-page/catalogues-page.component'),
  }
]
