import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { IGetRoleByIdGQL } from '@lpg-manager/role-store';
import { map } from 'rxjs';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./roles-landing-page/roles-landing-page.component'),
    pathMatch: 'full',
  },
  {
    path: 'new',
    loadComponent: () => import('./role-form/role-form.component'),
  },
  {
    path: ':roleId',
    loadComponent: () => import('./role-page/role-page.component'),
    resolve: {
      role: (route: ActivatedRouteSnapshot) =>
        inject(IGetRoleByIdGQL)
          .fetch({ id: route.params['roleId'] })
          .pipe(map((res) => res.data.role)),
    },
  },
  {
    path: ':roleId/edit',
    loadComponent: () => import('./role-form/role-form.component'),
    resolve: {
      role: (route: ActivatedRouteSnapshot) =>
        inject(IGetRoleByIdGQL)
          .fetch({ id: route.params['roleId'] })
          .pipe(map((res) => res.data.role)),
    },
  },
];
