import { Component, computed, forwardRef, inject, signal } from '@angular/core';
import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  Platform,
} from '@ionic/angular/standalone';

import { Html5QrcodeResult, Html5QrcodeScanner } from 'html5-qrcode';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Html5QrcodeError } from 'html5-qrcode/core';
import { InventoryItemStore } from '@lpg-manager/inventory-item-store';

@Component({
  selector: 'lpg-scanner-input',
  templateUrl: 'scanner-input.component.html',
  imports: [
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonRow,
    IonCol,
    IonText,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScannerInputComponent),
      multi: true,
    }
  ],
})
export class ScannerInputComponent implements ControlValueAccessor {
  scannerId = 'scan-reader' + crypto.randomUUID().substring(0, 4);
  html5QrcodeScanner?: Html5QrcodeScanner;
  onChanges!: (val: string[]) => void;
  onTouched!: () => void;
  scannedItems = signal([] as string[]);
  scanCount = computed(() => this.scannedItems().length);
  totalCount = computed(() => this.scannedItems().length);
  scanMessage = signal('');
  disabled = signal(false);

  writeValue(obj: string[]): void {
    this.scannedItems.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChanges = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  platform = inject(Platform);
  barCodes = signal<string[]>([]);
  scanModalOpen = signal(false);

  onScanFailure(errorMessage: string, error: Html5QrcodeError) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    // console.warn(`Code scan error = ${error}`);
  }

  async onScanSuccess(decodedText: string, result: Html5QrcodeResult) {
    if (!this.scannedItems().includes(decodedText)) {
      this.scannedItems.set([...this.scannedItems(), decodedText]);
      this.onChanges(this.scannedItems());
      this.scanMessage.set('Scan successful');
      await new Audio('/sounds/doorbell-tone.wav').play();
    } else {
      if (this.scanMessage() !== 'Code already scanned') {
        this.scanMessage.set('Code already scanned');
      }
    }
  }

  async startScanning() {
    this.scanModalOpen.set(true);

    this.html5QrcodeScanner = new Html5QrcodeScanner(
      this.scannerId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    this.html5QrcodeScanner.render(
      this.onScanSuccess.bind(this),
      this.onScanFailure.bind(this)
    );
  }

  async stopScanning() {
    this.scanModalOpen.set(false);
    this.html5QrcodeScanner?.clear();
  }
}
