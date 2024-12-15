import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { IGetBrandByIdGQL } from '@lpg-manager/brand-store';
import { map } from 'rxjs';

export const BRANDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./brands-landing-page/brands-landing-page.component'),
    pathMatch: 'full',
  },
  {
    path: 'new',
    loadComponent: () => import('./brand-form/brand-form.component'),
  },
  {
    path: ':brandId',
    loadComponent: () => import('./brand-page/brand-page.component'),
    resolve: {
      brand: (route: ActivatedRouteSnapshot) =>
        inject(IGetBrandByIdGQL)
          .fetch({ id: route.params['brandId'] })
          .pipe(map((res) => res.data.brand)),
    },
  },
  {
    path: ':brandId/edit',
    loadComponent: () => import('./brand-form/brand-form.component'),
    resolve: {
      brand: (route: ActivatedRouteSnapshot) =>
        inject(IGetBrandByIdGQL)
          .fetch({ id: route.params['brandId'] })
          .pipe(map((res) => res.data.brand)),
    },
  },
];
