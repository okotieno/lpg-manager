import { Component, computed, input } from '@angular/core';
import { IGetDispatchByIdQuery } from '@lpg-manager/dispatch-store';
import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonText,
} from '@ionic/angular/standalone';
import { JsonPipe } from '@angular/common';
import { UUIDDirective } from '@lpg-manager/uuid-pipe';
import { RouterLink } from '@angular/router';
import { IConsolidatedOrderStatus } from '@lpg-manager/types';

// Type for the Summarized Catalogue in the result
interface SummarizedCatalogue {
  id: string;
  name: string;
  quantity: number;
}

// Type for the Summarized Dealer in the result
interface SummarizedDealer {
  id: string;
  name: string;
  catalogues: SummarizedCatalogue[];
}

@Component({
  selector: 'lpg-delivery-page',
  templateUrl: './delivery-page.component.html',
  styleUrls: ['./delivery-page.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonText,
    UUIDDirective,
    RouterLink,
  ],

  providers: [],
})
export default class DeliveryPageComponent {
  dispatch = input<IGetDispatchByIdQuery['dispatch']>();

  consolidatedOrderStatusCreated = IConsolidatedOrderStatus.Created
  consolidatedOrderStatusDriverToDealerConfirmed = IConsolidatedOrderStatus.DriverToDealerConfirmed

  summarizedOrders = computed(() => {
    const consolidatedOrders = this.dispatch()?.consolidatedOrders ?? [];

    return consolidatedOrders
      .map((consolidatedOrder) =>
        consolidatedOrder.orders.map((order) => ({
          ...order,
          consolidatedOrderStatus: consolidatedOrder.status,
        }))
      )
      .flat()
      .map((order) => {
        const dealer = order.dealer;
        const catalogues: { id: string; name: string; quantity: number }[] = [];

        order.items.forEach((item) => {
          const catalogue = item?.catalogue;
          const existingCatalogue = catalogues.find(
            (c) => c.id === catalogue?.id
          );

          if (existingCatalogue) {
            existingCatalogue.quantity += item?.quantity ?? 0;
          } else {
            catalogues.push({
              id: catalogue?.id as string,
              name: catalogue?.name as string,
              quantity: item?.quantity as number,
            });
          }
        });

        return {
          consolidatedOrderStatus: order.consolidatedOrderStatus,
          id: dealer.id,
          name: dealer.name,
          catalogues,
        };
      });
  });
}
