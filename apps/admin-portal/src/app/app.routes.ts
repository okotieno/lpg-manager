import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@lpg-manager/auth-store';
import { map } from 'rxjs';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@lpg-manager/dashboard-page'),
    canMatch: [() => inject(AuthStore).isAuthenticatedGuard()],
  },
  {
    path: '',
    canMatch: [
      () =>
        inject(AuthStore)
          .isAuthenticatedGuard()
          .pipe(map((isAuthenticated) => !isAuthenticated)),
    ],
    loadChildren: () =>
      import('@lpg-manager/auth-page').then((m) => m.AUTH_ROUTES),
  },
];
