import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';
import { IGetTransporterByIdGQL } from '@lpg-manager/transporter-store';
import { BreadcrumbStore } from '@lpg-manager/breadcrumb';
import { FormExitGuardService, IHasUnsavedChanges } from '@lpg-manager/form-exit-guard';

export const STATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./transporters-landing-page/transporters-landing-page.component'),
    pathMatch: 'full',
    data: {
      routeLabel: 'Transporters',
      breadcrumbs: [
        { label: 'Administration', path: ['/dashboard', 'administration'] },
        { label: 'Transporters' },
      ],
    },
  },
  {
    path: 'new',
    loadComponent: () => import('./transporter-form/transporters-form.component'),
    data: {
      routeLabel: 'Create Transporter',
      breadcrumbs: [
        { label: 'Administration', path: ['/dashboard', 'administration'] },
        {
          label: 'Transporters',
          path: ['/dashboard', 'administration', 'transporters'],
        },
        { label: 'Create transporter' },
      ],
    },
    canDeactivate: [
      (component: IHasUnsavedChanges) =>
        inject(FormExitGuardService).hasUnsavedChanges(component),
    ],
  },
  {
    path: ':transporterId',
    data: {
      routeLabel: 'Transporters | :transporterName',
      breadcrumbs: [
        { label: 'Administration', path: ['/dashboard', 'administration'] },
        {
          label: 'Transporters',
          path: ['/dashboard', 'administration', 'transporters'],
        },
        { label: ':transporterName' },
      ],
    },
    resolve: {
      transporter: (route: ActivatedRouteSnapshot) => {
        const breadcrumbStore = inject(BreadcrumbStore);
        return inject(IGetTransporterByIdGQL)
          .fetch({ id: route.params['transporterId'] })
          .pipe(
            map((res) => res.data.transporter),
            tap((res) => {
              breadcrumbStore.updatePageTitleParams({
                transporterId: res?.id ?? '',
                transporterName: res?.name ?? '',
              });
            })
          );
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./transporter-page/transporter-page.component'),
      },
      {
        path: 'edit',
        loadComponent: () => import('./transporter-form/transporters-form.component'),
        data: {
          routeLabel: 'Edit transporter | :transporterName',
          breadcrumbs: [
            { label: 'Administration', path: ['/dashboard', 'administration'] },
            {
              label: 'Transporters',
              path: ['/dashboard', 'administration', 'transporters'],
            },
            {
              label: ':transporterName',
              path: ['/dashboard', 'administration', 'transporters', ':transporterId'],
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
