import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IconService } from '@lpg-manager/icon-service';
import { APP_ICONS } from './app.icons';

@Component({
  imports: [IonApp, IonRouterOutlet],
  selector: 'lpg-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  styles: ``,
  standalone: true
})
export class AppComponent {
  constructor( iconService: IconService) {
    iconService.registerIcons(APP_ICONS)
  }
}
