import { Component, inject } from '@angular/core';
import { InventoryStore } from '@lpg-manager/inventory-store';
import { QRCodeComponent } from 'angularx-qrcode';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { computed } from '@angular/core';

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
    IonTitle
  ],
  templateUrl: './view-inventory-change-page.component.html',
  providers: [InventoryStore]
})
export default class ViewInventoryChangePageComponent {
  inventoryStore = inject(InventoryStore);
  route = inject(ActivatedRoute);

  inventoryId = computed(() => this.route.snapshot.params['id']);
  // inventoryItems = computed(() => this.inventoryStore.inventoryItems());

  constructor() {
    // Load inventory items when component initializes
    if (this.inventoryId()) {
      this.loadInventoryItems(this.inventoryId());
    }
  }

  async loadInventoryItems(inventoryId: string) {
    // await this.inventoryStore.loadInventoryItems(inventoryId);
  }

  printQRCode(itemId: string) {
    const qrCodeElement = document.getElementById(`qrcode-${itemId}`);
    if (qrCodeElement) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(
        `<html><body>${qrCodeElement.innerHTML}</body></html>`
      );
      printWindow?.document.close();
      printWindow?.print();
    }
  }
}
