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
    JsonPipe,
    IonText,
    UUIDDirective,
    RouterLink,
  ],

  providers: [],
})
export default class DeliveryPageComponent {
  dispatch = input<IGetDispatchByIdQuery['dispatch']>();

  summarizedOrders = computed(() => {
    const orders = this.dispatch()?.orders ?? [];
    const summary: SummarizedDealer[] = [];

    orders.forEach((order) => {
      const dealer = order.dealer;

      // Find or create the dealer entry in the summary
      let dealerSummary = summary.find((d) => d.id === dealer.id);
      if (!dealerSummary) {
        dealerSummary = {
          id: dealer.id,
          name: dealer.name,
          catalogues: [],
        };
        summary.push(dealerSummary);
      }

      // Process each item in the order
      order.items.forEach((item) => {
        const catalogue = item?.catalogue;

        // Find or create the catalogue entry under this dealer
        let catalogueSummary = dealerSummary.catalogues.find(
          (c) => c.id === catalogue?.id
        );
        if (!catalogueSummary) {
          catalogueSummary = {
            id: catalogue?.id as string,
            name: catalogue?.name as string,
            quantity: 0,
          };
          dealerSummary.catalogues.push(catalogueSummary);
        }

        // Sum the quantities for each catalogue
        catalogueSummary.quantity += item?.quantity ?? 0;
      });
    });

    return summary;
  });
}
