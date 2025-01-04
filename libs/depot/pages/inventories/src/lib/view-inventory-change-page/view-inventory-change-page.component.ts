import {
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
  viewChildren,
} from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { computed } from '@angular/core';
import {
  IGetInventoryChangeByIdGQL,
  IGetInventoryChangeByIdQuery,
  InventoryChangeStore,
} from '@lpg-manager/inventory-change-store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'lpg-view-inventory-change-page',
  standalone: true,
  imports: [
    QRCodeComponent,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    JsonPipe,
    IonGrid,
    IonRow,
    IonCol,
  ],
  templateUrl: './view-inventory-change-page.component.html',
  providers: [InventoryChangeStore],
})
export default class ViewInventoryChangePageComponent {
  inventoryStore = inject(InventoryChangeStore);
  qrCodesWrappers = viewChildren(QRCodeComponent, { read: ElementRef });
  route = inject(ActivatedRoute);

  inventoryChange =
    input.required<IGetInventoryChangeByIdQuery['inventoryChange']>();

  async loadInventoryItems(inventoryId: string) {
    // await this.inventoryStore.loadInventoryItems(inventoryId);
  }

  printQRCode() {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(
      `<html lang="en"><body style="display: flex; flex-wrap: wrap">${this.qrCodesWrappers()
        .map((e) => e.nativeElement.innerHTML)
        .join('')}</body></html>`
    );
    printWindow?.document.close();
    printWindow?.print();
  }
}
