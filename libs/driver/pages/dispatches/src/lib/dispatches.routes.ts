import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { BreadcrumbStore } from '@lpg-manager/breadcrumb';
import { map, tap } from 'rxjs';
import {
  IGetDispatchByIdGQL,
} from '@lpg-manager/dispatch-store';

export const DISPATCHES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dispatches/dispatches-page.component'),
    data: {
      routeLabel: 'Operations',
      breadcrumbs: [
        { label: 'Operations', path: ['/dashboard', 'operations'] },
        { label: 'Dispatches' },
      ],
    },
  },
  {
    path: ':dispatchId',
    data: {
      routeLabel: 'View Dispatch | :dispatchName',
      breadcrumbs: [
        {
          label: 'Dispatches',
          path: ['/dashboard', 'dispatches'],
        },
        { label: 'View Dispatch' },
      ],
    },
    resolve: {
      dispatch: (route: ActivatedRouteSnapshot) => {
        const breadcrumbStore = inject(BreadcrumbStore);
        return inject(IGetDispatchByIdGQL)
          .fetch({ id: route.params['dispatchId'], includeDealer:true })
          .pipe(
            map((res) => res.data.dispatch),
            tap((res) => {
              breadcrumbStore.updatePageTitleParams({
                dispatchId: res?.id ?? '',
                dispatchName: '#' + (res?.id ?? '').slice(0, 8),
              });
            })
          );
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./view-dispatch/view-dispatch.component'),
      },
      {
        path: 'confirm-load',
        loadComponent: () => import('./confirm-load/confirm-load.component'),
      },
      {
        path: 'deliveries',
        loadChildren: () => import('@lpg-manager/driver-deliveries-page'),
        data: {
          routeLabel: 'Deliver Orders',
          breadcrumbs: [
            {
              label: 'Dispatches',
              path: ['/dashboard', 'dispatches'],
            },
            {
              label: ':dispatchName',
              path: ['/dashboard', 'dispatches', ':dispatchId'],
            },
            { label: 'Deliver' },
          ],
        },
      },
    ],
  },
];
