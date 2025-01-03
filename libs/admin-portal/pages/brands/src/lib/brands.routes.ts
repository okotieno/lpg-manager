import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { IGetBrandByIdGQL } from '@lpg-manager/brand-store';
import { map, tap } from 'rxjs';
import { BreadcrumbStore } from '@lpg-manager/breadcrumb';
import {
  FormExitGuardService,
  IHasUnsavedChanges,
} from '@lpg-manager/form-exit-guard';

export const BRANDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./brands-landing-page/brands-landing-page.component'),
    pathMatch: 'full',
    data: {
      routeLabel: 'Brands',
      breadcrumbs: [
        { label: 'Administration', path: ['/dashboard', 'administration'] },
        { label: 'Brands' },
      ],
    },
  },
  {
    path: 'new',
    loadComponent: () => import('./brand-form/brand-form.component'),
    canDeactivate: [
      (component: IHasUnsavedChanges) =>
        inject(FormExitGuardService).hasUnsavedChanges(component),
    ],
    data: {
      routeLabel: 'Create Brand',
      breadcrumbs: [
        { label: 'Administration', path: ['/dashboard', 'administration'] },
        { label: 'Brands', path: ['/dashboard', 'administration', 'brands'] },
        { label: 'Create brand' },
      ],
    },
  },
  {
    path: ':brandId',
    data: {
      routeLabel: 'Brands | :brandName',
      breadcrumbs: [
        { label: 'Administration', path: ['/dashboard', 'administration'] },
        { label: 'Brands', path: ['/dashboard', 'administration', 'brands'] },
        { label: ':brandName' },
      ],
    },
    resolve: {
      brand: (route: ActivatedRouteSnapshot) => {
        const breadcrumbStore = inject(BreadcrumbStore);
        return inject(IGetBrandByIdGQL)
          .fetch({ id: route.params['brandId'] })
          .pipe(
            map((res) => res.data.brand),
            tap((res) => {
              breadcrumbStore.updatePageTitleParams({
                brandId: res?.id ?? '',
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
        canDeactivate: [
          (component: IHasUnsavedChanges) =>
            inject(FormExitGuardService).hasUnsavedChanges(component),
        ],
        data: {
          routeLabel: 'Edit brand | :brandName',
          breadcrumbs: [
            { label: 'Administration', path: ['/dashboard', 'administration'] },
            {
              label: 'Brands',
              path: ['/dashboard', 'administration', 'brands'],
            },
            {
              label: ':brandName',
              path: ['/dashboard', 'administration', 'brands', ':brandId'],
            },
            { label: 'Edit' },
          ],
        },
        loadComponent: () => import('./brand-form/brand-form.component'),
      },
    ],
  },
];
