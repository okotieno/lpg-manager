import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { IGetRoleByIdGQL } from '@lpg-manager/roles-store';
import { map } from 'rxjs';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./roles-landing-page/roles-landing-page.component'),
    pathMatch: 'full',
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
];
