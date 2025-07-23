import { Component, input } from '@angular/core';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonButton,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { DispatchStore, IGetDispatchByIdQuery } from '@lpg-manager/dispatch-store';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';
import { RouterLink } from '@angular/router';
import { IConsolidatedOrderStatus } from '@lpg-manager/types';

@Component({
  selector: 'lpg-view-dispatch',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
    DatePipe,
    IonCard,
    IonCardContent,
    IonText,
    UUIDDirective,
    IonList,
    IonItem,
    IonLabel,
    IonItemDivider,
    CurrencyPipe,
    IonButton,
    IonIcon,
    IonButtons,
    RouterLink,
  ],
  template: `
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="12" sizeMd="6">
                <ion-text color="medium">Dispatch ID</ion-text>
                <p><span [lpgUUID]="$any(dispatch()?.id)"></span></p>
              </ion-col>
              <ion-col size="12" sizeMd="6" class="ion-text-md-end">
                <ion-badge [color]="getStatusColor($any(dispatch()?.status))">
                  {{ dispatch()?.status }}
                </ion-badge>
              </ion-col>
            </ion-row>

            <ion-list>
              <ion-item-divider>
                <ion-label>Dispatch Details</ion-label>
              </ion-item-divider>

              <ion-item>
                <ion-label>
                  <ion-text color="medium">Transporter</ion-text>
                  <p>{{ dispatch()?.transporter?.name }}</p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-label>
                  <ion-text color="medium">Driver</ion-text>
                  <p>{{ dispatch()?.driver?.user?.firstName }} {{ dispatch()?.driver?.user?.lastName }}</p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-label>
                  <ion-text color="medium">Vehicle</ion-text>
                  <p>{{ dispatch()?.vehicle?.registrationNumber }}</p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-label>
                  <ion-text color="medium">Dispatch Date</ion-text>
                  <p>{{ dispatch()?.dispatchDate | date }}</p>
                </ion-label>
              </ion-item>

              <ion-item-divider>
                <ion-label>Orders</ion-label>
              </ion-item-divider>

              @for (consolidatedOrder of dispatch()?.consolidatedOrders; track consolidatedOrder.id) {
                @for (order of consolidatedOrder.orders; track order.id) {
                  <ion-item>
                    <ion-label>
                      <ion-row class="ion-justify-content-between">
                        <h3>Order <span [lpgUUID]="order.id"></span></h3>
                        <ion-badge [color]="getStatusColor($any(consolidatedOrder.status))">
                          {{consolidatedOrderStatusMapping[consolidatedOrder.status]}}
                        </ion-badge>
                        <ion-badge [color]="getStatusColor($any(order.status))">
                          {{ order.status }}
                        </ion-badge>

                      </ion-row>
                      <p>Total Amount: {{ order.totalPrice | currency }}</p>
                    </ion-label>
                  </ion-item>
                }
              }
            </ion-list>
          </ion-grid>
          <ion-buttons class="ion-margin-start">
            @if (dispatch()?.status === 'PENDING') {
              <ion-button
                color="primary"
                shape="round"
                [routerLink]="['assign-load']"
                fill="outline">
                <ion-icon name="scanner-gun" slot="start"></ion-icon>
                Assign Load to Driver
              </ion-button>
            }
          </ion-buttons>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  providers: [DispatchStore],
})
export default class ViewDispatchComponent {

  dispatch = input.required<IGetDispatchByIdQuery['dispatch']>()
  consolidatedOrderStatusMapping: Record<IConsolidatedOrderStatus, string> = {
    [IConsolidatedOrderStatus.DriverToDealerConfirmed]: 'Pending dealer confirmation',
    [IConsolidatedOrderStatus.Created]: 'Pending dealer confirmation',
    [IConsolidatedOrderStatus.Completed]: 'Pending dealer confirmation',
    [IConsolidatedOrderStatus.DealerFromDriverConfirmed]: 'Pending dealer confirmation',
  }

  // TODO: figure out why colors are not being applied
  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'DEALER_FROM_DRIVER_CONFIRMED':
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
