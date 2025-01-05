import { Component, inject } from '@angular/core';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerOptions,
  CapacitorBarcodeScannerTypeHint,
  CapacitorBarcodeScannerTypeHintALLOption,
} from '@capacitor/barcode-scanner';
import { IonButton, Platform } from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-scanner-input-1',
  templateUrl: 'scanner-input.component.html',
  imports: [IonButton],
})
export class ScannerInput1Component {
  platform = inject(Platform)

  async scanBarCode() {
    if (this.platform.is('capacitor')) {
      CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
      }).then(response => {
        const result = response.ScanResult.split(";");
        if (result.length > 1) {
          console.log('Worksss')
        } else {

          console.log('Worksss ----')
          //TODO: Show Toast
        }
      });
    }
    else {
      console.log(this.platform.platforms())
    }
  }
}
