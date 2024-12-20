import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { IGetStationByIdGQL } from '@lpg-manager/station-store';

export const STATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./stations-landing-page/stations-landing-page.component'),
    pathMatch: 'full',
  },
  {
    path: 'new',
    loadComponent: () => import('./station-form/stations-form.component'),
  },
  {
    path: ':stationId',
    resolve: {
      station: (route: ActivatedRouteSnapshot) =>
        inject(IGetStationByIdGQL)
          .fetch({ id: route.params['stationId'] })
          .pipe(map((res) => res.data.station)),
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
      },
    ],
  },
];
