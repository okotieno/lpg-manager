import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-dashboard',
  standalone: true,
  imports: [IonContent],
  template: `
    <ion-content>
      <h1>Dashboard</h1>
    </ion-content>
  `,
  styles: ``
})
export class DashboardComponent {} 