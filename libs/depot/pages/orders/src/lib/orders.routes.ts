import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { IOrderStatus } from '@lpg-manager/types';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders-page/orders-page.component'),
    data: {
      routeLabel: 'Orders',
      // breadcrumbs: [{ label: 'Orders' }],
    },
    resolve: {
      breadcrumbs: (res: ActivatedRouteSnapshot) => {
        if(res.queryParams['status'] === IOrderStatus.Pending) {
          return [{ label: 'Orders', path: ['/dashboard', 'orders'] }, {label: 'Pending'}]
        }
        if(res.queryParams['status'] === IOrderStatus.Completed) {
          return [{ label: 'Orders', path: ['/dashboard', 'orders'] }, {label: 'Completed'}]
        }
        return [{ label: 'Orders' }]

      }
    }
  },
];
