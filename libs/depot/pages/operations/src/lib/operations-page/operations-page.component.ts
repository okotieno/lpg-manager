import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { DispatchStore } from '@lpg-manager/dispatch-store';

@Component({
  selector: 'lpg-operations',
  templateUrl: './operations-page.component.html',
  styleUrls: ['./operations-page.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonBadge,
    DatePipe,
    IonCard,
    IonCardContent,
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
      case 'CANCELED':
        return 'danger';
      default:
        return 'medium';
    }
  }
}
