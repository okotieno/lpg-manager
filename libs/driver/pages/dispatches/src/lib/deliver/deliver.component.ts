import { Component, input } from '@angular/core';
import {
  IonContent,
} from '@ionic/angular/standalone';
import {
  DispatchStore,
  IGetDispatchByIdQuery,
} from '@lpg-manager/dispatch-store';
import { ReactiveFormsModule } from '@angular/forms';
import { InventoryItemStore } from '@lpg-manager/inventory-item-store';

@Component({
  selector: 'lpg-assign-load',
  standalone: true,
  imports: [
    IonContent,
    ReactiveFormsModule,
  ],
  templateUrl: './deliver.component.html',
  styleUrl: './deliver.component.scss',
  providers: [DispatchStore, InventoryItemStore],
})
export default class DeliverComponent {
  dispatch = input.required<IGetDispatchByIdQuery['dispatch']>();
}
