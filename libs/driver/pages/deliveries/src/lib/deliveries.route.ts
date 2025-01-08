import { Routes } from '@angular/router';
import DeliveryPageComponent from './delivery-page/delivery-page.component';
import SummaryPageComponent from './summary-page/summary-page.component';

export const DELIVERY_ROUTES: Routes = [
  { path: '', component: DeliveryPageComponent },
  { path: ':dealerId', component: SummaryPageComponent },
];
