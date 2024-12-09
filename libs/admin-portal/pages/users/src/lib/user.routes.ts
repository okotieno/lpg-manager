import { Routes } from '@angular/router';

export const USERS_ROUTES:Routes = [
  {
    path: '',
    loadComponent: () => import('./users-landing-page/users-landing-page.component'),
    pathMatch: 'full',
    data: {
      routeLabel: "Users"
    }
  },
  {
    path: 'users',
    loadComponent: () => import('./users-page/users-page.component'),
  },
  {
    path: 'roles',
    loadChildren: () => import('@lpg-manager/roles-page'),
  }
]
