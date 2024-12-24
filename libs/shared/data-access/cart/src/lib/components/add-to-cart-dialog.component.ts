import {
  Component,
  effect,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICatalogueModel } from '@lpg-manager/types';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lpg-add-to-cart-dialog',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Add to Cart</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon slot="icon-only" name="circle-xmark"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card class="catalogue-card">
        <ion-row>
          <ion-col size="5">
            <ion-img
              [src]="catalogue().brand?.images?.[0]?.url ?? 'no-image-placeholder.webp'"
              class="catalogue-image"
            ></ion-img>
          </ion-col>
          <ion-col size="7">
            @if (catalogue().pricePerUnit) {
            <div class="price-tag">
              {{ catalogue().pricePerUnit | currency }}
            </div>
            }
            <p class="description">
              {{ catalogue().description || 'No description available' }}
            </p>

            <div class="specs">
              <ion-text color="medium">
                <p>
                  <ion-icon name="cube"></ion-icon>
                  {{ catalogue().quantityPerUnit }} {{ catalogue().unit }}
                </p>
              </ion-text>
            </div>
          </ion-col>
        </ion-row>
        <ion-card-header>
          <ion-card-title class="ion-text-wrap"
            >{{ catalogue().name }}
          </ion-card-title>
          <ion-card-subtitle>{{ catalogue().brand?.name }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content> </ion-card-content>
      </ion-card>
      <ion-item>
        <ion-label position="stacked">Quantity</ion-label>
        <ion-input
          type="number"
          [(ngModel)]="quantity"
          min="1"
          [max]="maxQuantity"
        ></ion-input>
      </ion-item>
    </ion-content>
    <ion-footer class="ion-padding">
      <ion-button (click)="confirm()" [disabled]="!isValidQuantity()">
        Add to Cart
      </ion-button>
    </ion-footer>
  `,
  styles: [
    `
      ion-img {
        max-width: 200px;
      }
    `,
  ],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    CurrencyPipe,
    IonCard,
    IonImg,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonIcon,
    IonRow,
    IonCol,
    IonFooter,
  ],
})
export class AddToCartDialogComponent {
  #modalCtrl = inject(ModalController);
  ionInput = viewChild.required(IonInput);
  ionInputChangeEffect = effect(async () => {
    this.ionInput();
    untracked(() => {
      setTimeout(async () => {
        await this.ionInput().setFocus();
      }, 500);
    });
  });

  catalogue = input.required<ICatalogueModel>();
  quantity = 1;
  maxQuantity = 99; // You might want to set this based on available inventory

  isValidQuantity(): boolean {
    return this.quantity >= 1 && this.quantity <= this.maxQuantity;
  }

  async dismiss() {
    await this.#modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    await this.#modalCtrl.dismiss(
      {
        quantity: this.quantity,
        catalogueId: this.catalogue().id,
      },
      'confirm'
    );
  }
}
