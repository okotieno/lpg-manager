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
import { IStationModel } from '@lpg-manager/types';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'lpg-station-page',
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
  templateUrl: './station-page.component.html',
  styleUrls: ['./station-page.component.scss'],
})
export default class StationPageComponent {
  station = input<IStationModel>();

  get brands() {
    return this.station()?.brands || [];
  }
}
