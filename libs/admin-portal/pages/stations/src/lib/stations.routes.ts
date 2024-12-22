import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';
import { IGetStationByIdGQL } from '@lpg-manager/station-store';
import { BreadcrumbStore } from '@lpg-manager/breadcrumb';

export const STATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./stations-landing-page/stations-landing-page.component'),
    pathMatch: 'full',
    data: {
      routeLabel: 'Stations',
      breadcrumbs: [
        { label: 'Administration', path: ['/dashboard', 'administration'] },
        { label: 'Stations' },
      ],
    },
  },
  {
    path: 'new',
    loadComponent: () => import('./station-form/stations-form.component'),
    data: {
      routeLabel: 'Create Station',
      breadcrumbs: [
        { label: 'Administration', path: ['/dashboard', 'administration'] },
        {
          label: 'Stations',
          path: ['/dashboard', 'administration', 'stations'],
        },
        { label: 'Create station' },
      ],
    },
  },
  {
    path: ':stationId',
    data: {
      routeLabel: 'Stations | :stationName',
      breadcrumbs: [
        { label: 'Administration', path: ['/dashboard', 'administration'] },
        {
          label: 'Stations',
          path: ['/dashboard', 'administration', 'stations'],
        },
        { label: ':stationName' },
      ],
    },
    resolve: {
      station: (route: ActivatedRouteSnapshot) => {
        const breadcrumbStore = inject(BreadcrumbStore);
        return inject(IGetStationByIdGQL)
          .fetch({ id: route.params['stationId'] })
          .pipe(
            map((res) => res.data.station),
            tap((res) => {
              breadcrumbStore.updatePageTitleParams({
                stationId: res?.id ?? '',
                stationName: res?.name ?? '',
              });
            })
          );
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./station-page/stations-page.component'),
      },
      {
        path: 'edit',
        loadComponent: () => import('./station-form/stations-form.component'),
        data: {
          routeLabel: 'Edit station | :stationName',
          breadcrumbs: [
            { label: 'Administration', path: ['/dashboard', 'administration'] },
            {
              label: 'Stations',
              path: ['/dashboard', 'administration', 'stations'],
            },
            {
              label: ':stationName',
              path: ['/dashboard', 'administration', 'stations', ':stationId'],
            },
            { label: 'Edit' },
          ],
        },
      },
    ],
  },
];
