import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { IGetBrandByIdGQL } from '@lpg-manager/brand-store';
import { map } from 'rxjs';

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
    path: ':brandId',
    loadComponent: () => import('./station-page/stations-page.component'),
    resolve: {
      brand: (route: ActivatedRouteSnapshot) =>
        inject(IGetBrandByIdGQL)
          .fetch({ id: route.params['brandId'] })
          .pipe(map((res) => res.data.brand)),
    },
  },
  {
    path: ':brandId/edit',
    loadComponent: () => import('./station-form/stations-form.component'),
    resolve: {
      brand: (route: ActivatedRouteSnapshot) =>
        inject(IGetBrandByIdGQL)
          .fetch({ id: route.params['brandId'] })
          .pipe(map((res) => res.data.brand)),
    },
  },
];
