import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./roles-landing-page/roles-landing-page.component'),
    pathMatch: 'full'
  }
]; 