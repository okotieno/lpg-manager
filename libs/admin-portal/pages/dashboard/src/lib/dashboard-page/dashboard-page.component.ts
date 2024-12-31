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
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonPopover,
  IonListHeader,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { ThemeService } from '@lpg-manager/theme-service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbStore } from '@lpg-manager/breadcrumb';
import { TitleCasePipe } from '@angular/common';
import { AuthStore } from '@lpg-manager/auth-store';
import { NotificationBellComponent } from '@lpg-manager/notification-component';

@Component({
  selector: 'lpg-dashboard',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonMenu,
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel,
    IonPopover,
    IonListHeader,
    RouterOutlet,
    RouterLink,
    BreadcrumbComponent,
    IonRow,
    IonText,
    TitleCasePipe,
    NotificationBellComponent,
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
  #breadcrumbStore = inject(BreadcrumbStore);
  #authStore = inject(AuthStore);

  pageTitle = this.#breadcrumbStore.pageTitle;

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
