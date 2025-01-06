import { Component, inject, input } from '@angular/core';
import {
  IonButton, IonCol,
  IonContent,
  IonHeader, IonIcon,
  IonRow, IonText,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-scanner-dialog',
  imports: [
    IonRow,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonCol,
    IonText,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">Scanner</ion-title>
        <ion-button fill="clear" shape="round" slot="end" (click)="dismiss()">
          <ion-icon name="circle-xmark" slot="icon-only" />
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-row class=" ion-justify-content-center">
        <ion-col size="12" class="ion-text-center">
          <ion-text>
            {{ scanCount() }} of {{ totalCount() }} items scanned
          </ion-text>
        </ion-col>
        <div
          #scanReader
          id="scan-reader"
          style="width: 400px; height: 400px"
        ></div>
        <ion-col size="12" class="ion-text-center">
          {{ scanMessage() }}
        </ion-col>
      </ion-row>
    </ion-content>`,
})
export class ScannerDialogComponent {
  #modalCtrl = inject(ModalController);
  scanCount = input(0);
  totalCount = input(0);
  scanMessage = input('');

  dismiss() {
    this.#modalCtrl.dismiss();
  }
}
