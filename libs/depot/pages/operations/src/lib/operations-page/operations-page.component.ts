import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent, IonCardHeader, IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow, IonText
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { DispatchStore } from '@lpg-manager/dispatch-store';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';

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
    IonText,
    UUIDDirective,
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
