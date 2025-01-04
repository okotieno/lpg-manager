import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { BreadcrumbStore } from '@lpg-manager/breadcrumb';
import { IGetDispatchByIdGQL } from '@lpg-manager/dispatch-store';
import { map, tap } from 'rxjs';
import {
  IGetInventoryChangeByIdGQL,
  InventoryChangeStore,
} from '@lpg-manager/inventory-change-store';

export const INVENTORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./inventories-page/inventories-page.component'),
    data: {
      routeLabel: 'Inventories',
      breadcrumbs: [{ label: 'Inventories' }],
    },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./inventory-management/inventory-management.component'),
    data: {
      routeLabel: 'Inventories',
      breadcrumbs: [{ label: 'Inventories' }],
    },
  },
  // {
  //   path: 'view',
  //   loadComponent: () =>
  //     import('./view-inventory-page/view-inventory-page.component'),
  //   data: {
  //     routeLabel: 'View Inventory',
  //     breadcrumbs: [{ label: 'View Inventory' }],
  //   },
  // },

  {
    path: 'changes/:inventoryChangeId',
    loadComponent: () =>
      import(
        './view-inventory-change-page/view-inventory-change-page.component'
      ),
    data: {
      routeLabel: 'Inventories Change | :inventoryChangeName ',
      breadcrumbs: [
        { label: 'View Inventory', path: ['/dashboard', 'inventories'] },
        { label: 'Inventory movement' },
      ],
    },
    resolve: {
      inventoryChange: (route: ActivatedRouteSnapshot) => {
        const breadcrumbStore = inject(BreadcrumbStore);
        return inject(IGetInventoryChangeByIdGQL)
          .fetch({ id: route.params['inventoryChangeId'] })
          .pipe(
            map((res) => res.data.inventoryChange),
            tap((res) => {
              breadcrumbStore.updatePageTitleParams({
                inventoryChangeId: res?.id ?? '',
                inventoryChangeName: '#' + (res?.id ?? '').slice(0, 8),
              });
            })
          );
      },
    },
  },
];
