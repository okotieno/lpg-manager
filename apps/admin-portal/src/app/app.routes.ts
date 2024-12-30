import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@lpg-manager/auth-store';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    canMatch: [() => inject(AuthStore).isGuestGuard()],
    redirectTo: 'auth',
  },
  {
    path: 'auth',
    canMatch: [() => inject(AuthStore).isAuthenticatedGuard()],
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    canMatch: [() => inject(AuthStore).isGuestGuard()],
    redirectTo: 'auth',
  },
  {
    path: '',
    pathMatch: 'full',
    canMatch: [() => inject(AuthStore).isAuthenticatedGuard()],
    redirectTo: 'dashboard',
  },
  {
    path: 'auth',
    loadChildren: () => import('@lpg-manager/auth-page'),
    canMatch: [() => inject(AuthStore).isGuestGuard()],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('@lpg-manager/dashboard-page'),
    canMatch: [() => inject(AuthStore).isAuthenticatedGuard()],
  },
];
