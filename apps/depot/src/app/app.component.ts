import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IconService } from '@lpg-manager/icon-service';
import { APP_ICONS } from './app.icons';

@Component({
  imports: [RouterModule, IonApp, IonRouterOutlet],
  selector: 'lpg-root',
  template: `
    <ion-app>
      <ion-router-outlet [animated]="true"></ion-router-outlet>
    </ion-app>
  `,
  styles: ``,
})
export class AppComponent {
  constructor( iconService: IconService) {
    iconService.registerIcons(APP_ICONS)
  }
}
