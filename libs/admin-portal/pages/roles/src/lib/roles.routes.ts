import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { IGetRoleByIdGQL } from '@lpg-manager/role-store';
import { map, tap } from 'rxjs';
import { BreadcrumbStore } from '@lpg-manager/breadcrumb';
import { FormExitGuardService, IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./roles-landing-page/roles-landing-page.component'),
    pathMatch: 'full',
    data: {
      routeLabel: 'Roles',
      breadcrumbs: [
        {
          label: 'User management',
          path: ['/dashboard', 'user-management'],
        },
        { label: 'Roles' },
      ],
    },
  },
  {
    path: 'new',
    loadComponent: () => import('./role-form/role-form.component'),
    canDeactivate: [
      (component: IHasUnsavedChanges) =>
        inject(FormExitGuardService).hasUnsavedChanges(component),
    ],
    data: {
      routeLabel: 'Create Role',
      breadcrumbs: [
        {
          label: 'User management',
          path: ['/dashboard', 'user-management'],
        },
        {
          label: 'Roles',
          path: ['/dashboard', 'user-management', 'roles'],
        },
        { label: 'Create role' },
      ],
    },
  },
  {
    path: ':roleId',
    data: {
      routeLabel: 'Roles | :roleName',
      breadcrumbs: [
        {
          label: 'User management',
          path: ['/dashboard', 'user-management'],
        },
        {
          label: 'Roles',
          path: ['/dashboard', 'user-management', 'roles'],
        },
        { label: ':roleName' },
      ],
    },
    resolve: {
      role: (route: ActivatedRouteSnapshot) => {
        const breadcrumbStore = inject(BreadcrumbStore);
        return inject(IGetRoleByIdGQL)
          .fetch({ id: route.params['roleId'] })
          .pipe(
            map((res) => res.data.role),
            tap((res) => {
              breadcrumbStore.updatePageTitleParams({
                roleId: res?.id ?? '',
                roleName: `${res?.name}`,
              });
            })
          );
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./role-page/role-page.component'),
      },
      {
        path: 'edit',
        loadComponent: () => import('./role-form/role-form.component'),
        data: {
          routeLabel: 'Edit role | :roleName',
          breadcrumbs: [
            {
              label: 'User management',
              path: ['/dashboard', 'user-management'],
            },
            {
              label: 'Roles',
              path: ['/dashboard', 'user-management', 'roles'],
            },
            {
              label: ':roleName',
              path: ['/dashboard', 'user-management', 'roles', ':roleId'],
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
];
