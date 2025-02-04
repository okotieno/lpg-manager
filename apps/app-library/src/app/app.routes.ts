import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@lpg-manager/auth-store';
export const appRoutes: Route[] = [
  {
    path: '',
    canMatch: [() => inject(AuthStore).loadUserInfoGuard()],
    children: [
      {
        path: '',
        loadChildren: () => import('@lpg-manager/app-library-dashboard-page'),
      }
    ],
  },
];
