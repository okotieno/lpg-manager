import { Component, computed, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonRow,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LandingPageImageComponent } from './landing-page-image/landing-page-image.component';
import { Theme, ThemeService } from '@lpg-manager/theme-service';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    IonContent,
    IonRow,
    IonCol,
    LandingPageImageComponent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonButtons,
    RouterOutlet,
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPageComponent {
  themeService = inject(ThemeService);
  currentIcon = computed(() => this.getIcon(this.themeService.theme()));
  private getIcon(theme: Theme) {
    switch (theme) {
      case 'light':
        return 'sun';
      case 'dark':
        return 'moon';
      default:
        return 'desktop';
    }
  }
  toggleTheme() {
    const themes: Theme[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(this.themeService.theme());
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    this.themeService.setTheme(nextTheme);
  }
}
