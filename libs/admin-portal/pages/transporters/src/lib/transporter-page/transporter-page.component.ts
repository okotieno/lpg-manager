import { Component, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle, IonChip,
  IonCol,
  IonGrid,
  IonRow,
  IonText
} from '@ionic/angular/standalone';
import { ITransporterModel } from '@lpg-manager/types';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'lpg-transporter-page',
  standalone: true,
  imports: [
    IonText,
    TitleCasePipe,
    IonRow,
    IonGrid,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
  ],
  templateUrl: './transporter-page.component.html',
  styleUrls: ['./transporter-page.component.scss'],
})
export default class TransporterPageComponent {
  transporter = input<ITransporterModel>();

  get drivers() {
    return this.transporter()?.drivers || [];
  }
}
