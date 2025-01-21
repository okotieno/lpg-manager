import { Component, computed, inject } from '@angular/core';
import { IonCol, IonContent, IonRow } from '@ionic/angular/standalone';
import { ThemeService } from '@lpg-manager/theme-service';
import { Router } from '@angular/router';
import { BreadcrumbStore } from '@lpg-manager/breadcrumb';
import { AuthStore } from '@lpg-manager/auth-store';

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
    this.#router.navigate(['/home', 'profile']);
  }
}
