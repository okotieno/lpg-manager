import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { IGetUserByIdGQL } from '@lpg-manager/user-store';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./users-landing-page/users-landing-page.component'),
    data: {
      routeLabel: "User management"
    }
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./users-page/users-page.component'),
        data: {
          routeLabel: "Users"
        }
      },
      {
        path: 'new',
        loadComponent: () => import('./user-form/user-form.component'),
        data: {
          routeLabel: "Create user"
        }
      },
      {
        path: ':userId',
        resolve: {
          user: (route: ActivatedRouteSnapshot) =>
            inject(IGetUserByIdGQL)
              .fetch({ id: route.params['userId'] })
              .pipe(map((res) => res.data.user)),
        },
        children: [
          {
            path: 'edit',
            loadComponent: () => import('./user-form/user-form.component'),
            data: {
              routeLabel: "Edit user"
            }
          },
        ],
      },
    ]
  }
];
