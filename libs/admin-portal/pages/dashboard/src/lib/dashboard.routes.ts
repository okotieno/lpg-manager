import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES:Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-page/dashboard-page.component'),
    children: [
      {
        path: 'user-management',
        loadChildren: () => import('@lpg-manager/users-page').then(r => r.USERS_ROUTES),
        title: 'LPG - Dashboard',
        data: {
          routeLabel: 'Dashboard'
        }
      },
      {
        path: 'administration',
        loadChildren: () => import('@lpg-manager/administration-page').then(r => r.ADMINISTRATION_ROUTES),
        title: 'LPG - Administration',
        data: {
          routeLabel: 'Administration'
        }
      }
    ]
  }
]
