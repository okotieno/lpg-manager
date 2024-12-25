import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';
import { IGetUserByIdGQL } from '@lpg-manager/user-store';
import { BreadcrumbStore } from '@lpg-manager/breadcrumb';
import { FormExitGuardService, IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./users-landing-page/users-landing-page.component'),
    data: {
      routeLabel: 'User management',
      breadcrumbs: [{ label: 'User management' }],
    },
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./users-page/users-page.component'),
        data: {
          routeLabel: 'Users',
          breadcrumbs: [
            {
              label: 'User management',
              path: ['/dashboard', 'user-management'],
            },
            { label: 'Users' },
          ],
        },
      },
      {
        path: 'new',
        loadComponent: () => import('./user-form/user-form.component'),
        data: {
          routeLabel: 'Create user',
          breadcrumbs: [
            {
              label: 'User management',
              path: ['/dashboard', 'user-management'],
            },
            {
              label: 'Users',
              path: ['/dashboard', 'user-management', 'users'],
            },
            { label: 'Create user' },
          ],
        },
        canDeactivate: [
          (component: IHasUnsavedChanges) =>
            inject(FormExitGuardService).hasUnsavedChanges(component),
        ],
      },
      {
        path: ':userId',
        data: {
          routeLabel: 'Users | :userName',
          breadcrumbs: [
            {
              label: 'User management',
              path: ['/dashboard', 'user-management'],
            },
            {
              label: 'Users',
              path: ['/dashboard', 'user-management', 'users'],
            },
            { label: ':userName' },
          ],
        },
        resolve: {
          user: (route: ActivatedRouteSnapshot) => {
            const breadcrumbStore = inject(BreadcrumbStore);
            return inject(IGetUserByIdGQL)
              .fetch({ id: route.params['userId'] })
              .pipe(
                map((res) => res.data.user),
                tap((res) => {
                  breadcrumbStore.updatePageTitleParams({
                    userId: res?.id ?? '',
                    userName: `${res?.firstName} ${res?.lastName}`,
                  });
                })
              );
          },
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            children: []
          },
          {
            path: 'edit',
            loadComponent: () => import('./user-form/user-form.component'),
            data: {
              routeLabel: 'Edit user | :userName',
              breadcrumbs: [
                {
                  label: 'User management',
                  path: ['/dashboard', 'user-management'],
                },
                {
                  label: 'Users',
                  path: ['/dashboard', 'user-management', 'users'],
                },
                {
                  label: ':userName',
                  path: ['/dashboard', 'user-management', 'users', ':userId'],
                },
                { label: 'Edit' },
              ],
            },
            canDeactivate: [
              (component: IHasUnsavedChanges) =>
                inject(FormExitGuardService).hasUnsavedChanges(component),
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'roles',
    loadChildren: () => import('@lpg-manager/roles-page')
  }
];
