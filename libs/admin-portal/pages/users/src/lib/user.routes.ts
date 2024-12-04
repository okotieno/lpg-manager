import { Routes } from '@angular/router';

export const USERS_ROUTES:Routes = [
  {
    path: '',
    loadComponent: () => import('./users-page/users-page.component'),
    pathMatch: 'full'
  }
]
