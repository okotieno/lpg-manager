import { Component, inject, input } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem, IonItemDivider,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'lpg-confirm-dispatch-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Confirm Dispatch</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label>
            <h2>Order #{{ order().id.slice(-8) }}</h2>
            <ion-text color="medium">
              <p>{{ order().createdAt | date : 'medium' }}</p>
            </ion-text>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <ion-text color="medium">Dealer</ion-text>
            <h3>{{ order().dealer.name }}</h3>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <ion-text color="medium">Total Amount</ion-text>
            <h3>{{ order().totalPrice | currency }}</h3>
          </ion-label>
        </ion-item>

        <ion-item-divider>
          <ion-label>Order Items</ion-label>
        </ion-item-divider>

        @for (item of order().items; track item.id) {
        <ion-item>
          <ion-label>
            <h3>{{ item.catalogue.name }}</h3>
            <p>
              <ion-text color="medium">
                Quantity: {{ item.quantity }} ×
                {{ item.catalogue.quantityPerUnit }} {{ item.catalogue.unit }}
              </ion-text>
            </p>
          </ion-label>
          <ion-text slot="end" color="primary">
            {{ item.quantity * item.catalogue.pricePerUnit | currency }}
          </ion-text>
        </ion-item>
        }
      </ion-list>
    </ion-content>

    <ion-footer class="ion-padding">
      <ion-buttons class="ion-justify-content-between">
        <ion-button fill="outline" color="medium" (click)="dismiss()">
          Cancel
        </ion-button>
        <ion-button color="primary" (click)="confirm()">
          Confirm Dispatch
        </ion-button>
      </ion-buttons>
    </ion-footer>
  `,
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonFooter,
    DatePipe,
    CurrencyPipe,
    IonItemDivider,
  ],
})
export class ConfirmDispatchModalComponent {
  order = input.required<any>();
  #modalCtrl = inject(ModalController);

  async dismiss() {
    await this.#modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    await this.#modalCtrl.dismiss(this.order(), 'confirm');
  }
}
