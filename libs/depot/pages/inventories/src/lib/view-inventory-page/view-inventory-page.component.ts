import { Component, inject } from '@angular/core';
import { InventoryStore } from '@lpg-manager/inventory-store';
import { QRCodeComponent } from 'angularx-qrcode';
import { IonButton, IonContent, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'lpg-view-inventory-page',
  standalone: true,
  imports: [QRCodeComponent, IonContent, IonList, IonItem, IonLabel, IonButton],
  templateUrl: './view-inventory-page.component.html',
  providers: [
    InventoryStore
  ]
})
export default class ViewInventoryPageComponent {
  inventoryStore = inject(InventoryStore);
  public qrCodeSrc!: SafeUrl

  inventories = this.inventoryStore.searchedItemsEntities;

  printQRCode(id: string) {
    const qrCodeElement = document.getElementById(`qrcode-${id}`);
    if (qrCodeElement) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(
        `<html><body style="background: yellow">${qrCodeElement.innerHTML}</body></html>`
      );
      printWindow?.document.close();
      printWindow?.print();
    }
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeSrc = url
  }

  // async scanBarcode() {
  //   try {
  //     // Request camera permission
  //     await BarcodeScanner.requestPermissions();
  //
  //     // Start the barcode scanner
  //     const result = await BarcodeScanner.startScan();
  //
  //     // Check if a barcode was scanned
  //     if (result.hasContent) {
  //       console.log('Scanned content:', result.content);
  //       // You can now use the scanned content (e.g., inventory ID)
  //       // Implement your logic here, e.g., navigate to the inventory details page
  //     }
  //   } catch (error) {
  //     console.error('Error scanning barcode:', error);
  //   }
  // }
}
