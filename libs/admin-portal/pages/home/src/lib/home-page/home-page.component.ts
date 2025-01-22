import { Component } from '@angular/core';
import { IonCol, IonContent, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-home',
  standalone: true,
  imports: [IonContent, IonCol, IonRow],
  templateUrl: './home-page.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
})
export default class DashboardComponent {
}
