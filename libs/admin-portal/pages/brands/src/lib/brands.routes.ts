import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { IGetBrandByIdGQL } from '@lpg-manager/brand-store';
import { catchError, map, of, tap } from 'rxjs';
import { BreadcrumbStore } from '@lpg-manager/breadcrumb';

export const BRANDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./brands-landing-page/brands-landing-page.component'),
    pathMatch: 'full',
    data: {
      routeLabel: 'Brands',
    },
  },
  {
    path: 'new',
    loadComponent: () => import('./brand-form/brand-form.component'),
    data: {
      routeLabel: 'Create Brand',
    },
  },
  {
    path: ':brandId',
    data: {
      routeLabel: 'Brands | :brandName',
    },
    resolve: {
      brand: (route: ActivatedRouteSnapshot) => {
        const breadCrumbStore = inject(BreadcrumbStore);
        return inject(IGetBrandByIdGQL)
          .fetch({ id: route.params['brandId'] })
          .pipe(
            map((res) => res.data.brand),
            tap((res) => {
              breadCrumbStore.updatePageTitleParams({
                brandName: res?.name ?? '',
              });
            })
          );
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./brand-page/brand-page.component'),
      },
      {
        path: 'edit',
        data: {
          routeLabel: 'Edit brand | :brandName',
        },
        loadComponent: () => import('./brand-form/brand-form.component'),
        resolve: {
          brand: (route: ActivatedRouteSnapshot) =>
            inject(IGetBrandByIdGQL)
              .fetch({ id: route.params['brandId'] })
              .pipe(map((res) => res.data.brand)),
        },
      },
    ],
  },
];
