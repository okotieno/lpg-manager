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
  IonRow, IonText
} from '@ionic/angular/standalone';
import { DatePipe, JsonPipe } from '@angular/common';
import { DispatchStore } from '@lpg-manager/dispatch-store';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';

@Component({
  selector: 'lpg-dispatches-page',
  templateUrl: './dispatches-page.component.html',
  styleUrls: ['./dispatches-page.component.scss'],
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
    JsonPipe,
  ],
  providers: [DispatchStore],
})
export default class DispatchesPageComponent {
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
