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
  IonContent,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import {
  IGetInventoryChangeByIdQuery,
  InventoryChangeStore,
} from '@lpg-manager/inventory-change-store';

@Component({
  selector: 'lpg-view-inventory-change-page',
  standalone: true,
  imports: [
    QRCodeComponent,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
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
      `<html lang="en"><body style="display: flex; flex-wrap: wrap; align-content: start">${this.qrCodesWrappers()
        .map((e) => e.nativeElement.innerHTML)
        .join('')}</body></html>`
    );
    printWindow?.document.close();
    printWindow?.print();
  }
}
