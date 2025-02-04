import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IconService } from '@lpg-manager/icon-service';
import { APP_ICONS } from './app.icons';

@Component({
  imports: [
    RouterModule,
    IonApp,
    IonRouterOutlet
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor( iconService: IconService) {
    iconService.registerIcons(APP_ICONS)
  }
}
