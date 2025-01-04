import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonCard,
  IonCardContent, IonCardHeader, IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from '@ionic/angular/standalone';
import { DispatchStore } from '@lpg-manager/dispatch-store';

@Component({
  selector: 'lpg-operations',
  templateUrl: './operations-page.component.html',
  styleUrls: ['./operations-page.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
  ],
  providers: [DispatchStore],
})
export default class OperationsPageComponent {
  #dispatchStore = inject(DispatchStore);
  dispatches = this.#dispatchStore.items;

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_TRANSIT':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'medium';
    }
  }
}
