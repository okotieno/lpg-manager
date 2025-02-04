import { Component, computed, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPopover, IonRouterOutlet,
  IonRow,
  IonText,
  IonToolbar
} from '@ionic/angular/standalone';
import { ThemeService } from '@lpg-manager/theme-service';
import { Router } from '@angular/router';
import { AuthStore } from '@lpg-manager/auth-store';

@Component({
  selector: 'lpg-dashboard',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel,
    IonPopover,
    IonRow,
    IonText,
    IonRouterOutlet,
  ],
  templateUrl: './dashboard-page.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
})
export default class DashboardComponent {
  #themeService = inject(ThemeService);
  #router = inject(Router);
  #authStore = inject(AuthStore);

  currentThemeIcon = computed(() => {
    switch (this.#themeService.theme()) {
      case 'light':
        return 'sun';
      case 'dark':
        return 'moon';
      default:
        return 'desktop';
    }
  });

  toggleTheme() {
    const themes = ['system', 'light', 'dark'] as const;
    const currentIndex = themes.indexOf(this.#themeService.theme());
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    this.#themeService.setTheme(nextTheme);
  }

  async logout() {
    await this.#authStore.logout();
    await this.#router.navigate(['/auth', 'login']);
  }

  goToProfile() {
    this.#router.navigate(['/dashboard', 'profile']);
  }
}
