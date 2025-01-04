import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonFooter,
  IonBadge,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { DispatchStore, IGetDispatchByIdQuery } from '@lpg-manager/dispatch-store';

@Component({
  selector: 'lpg-assign-load',
  standalone: true,
  imports: [
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonFooter,
    IonItemDivider,
    IonBadge,
  ],
  template: `
    <ion-content class="ion-padding">
      @if (dispatch(); as dispatch) {
        <ion-list>
          <ion-item>
            <ion-label>
              <h2>Driver</h2>
              <p>{{ dispatch.driver.user.firstName }} {{ dispatch.driver.user.lastName }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>
              <h2>Vehicle</h2>
              <p>{{ dispatch.vehicle.registrationNumber }}</p>
            </ion-label>
          </ion-item>

          <ion-item-divider>
            <ion-label>Orders to Transfer</ion-label>
          </ion-item-divider>

          @for (order of dispatch.orders; track order.id) {
            <ion-item>
              <ion-label>
                <h3>Order #{{ order.id }}</h3>
<!--                <p>{{ order.dealer.name }}</p>-->
<!--                <p>Total Items: {{ order.items.length }}</p>-->
              </ion-label>
              <ion-badge slot="end" color="success">Ready</ion-badge>
            </ion-item>
          }
        </ion-list>
      }
    </ion-content>

    <ion-footer class="ion-padding">
      <ion-buttons class="ion-justify-content-end">
        <ion-button color="primary" (click)="confirmAssignment()">
          Confirm Assignment
        </ion-button>
      </ion-buttons>
    </ion-footer>
  `,
  providers: [
    DispatchStore
  ]
})
export default class AssignLoadComponent {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #dispatchStore = inject(DispatchStore);

  dispatch = input.required<IGetDispatchByIdQuery['dispatch']>()

  async confirmAssignment() {
    const dispatchId = this.dispatch()?.id;
    if (dispatchId) {
      // await this.#dispatchStore.updateDispatchStatus(dispatchId, 'IN_TRANSIT');
      // await this.#router.navigate(['../'], { relativeTo: this.#route });
    }
  }
}
