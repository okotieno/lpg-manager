import { Component, inject, input } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonLabel, IonTextarea, IonButton, IonButtons, IonFooter,
  ModalController, IonIcon
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lpg-reject-order-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Reject Order</ion-title>
        <ion-buttons slot="end">
          <ion-button shape="round" fill="clear" color="danger" (click)="dismiss()">
            <ion-icon name="circle-xmark" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Reason for Rejection</ion-label>
        <ion-textarea
          [(ngModel)]="rejectionReason"
          placeholder="Enter reason for rejecting this order..."
          [rows]="4"
        ></ion-textarea>
      </ion-item>
    </ion-content>

    <ion-footer class="ion-padding">
      <ion-buttons class="ion-justify-content-between">
        <ion-button fill="outline" color="medium" (click)="dismiss()">
          Cancel
        </ion-button>
        <ion-button
          color="danger"
          (click)="confirm()"
          [disabled]="!rejectionReason.trim()"
        >
          Reject Order
        </ion-button>
      </ion-buttons>
    </ion-footer>
  `,
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonButtons,
    IonFooter,
    FormsModule,
    IonIcon,
  ],
})
export class RejectOrderModalComponent {
  order = input.required<any>();
  #modalCtrl = inject(ModalController);
  rejectionReason = '';

  async dismiss() {
    await this.#modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    await this.#modalCtrl.dismiss(
      {
        reason: this.rejectionReason,
      },
      'confirm'
    );
  }
}
