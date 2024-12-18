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
  IonPopover, IonListHeader,
} from '@ionic/angular/standalone';
import { ThemeService } from '@lpg-manager/theme-service';
import { AuthStore } from '@lpg-manager/auth-store';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

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
  ],
  templateUrl: './dashboard-page.component.html',
  styles: `
    :host {
      height: 100%;
    }
  `,
})
export default class DashboardComponent {
  private themeService = inject(ThemeService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  currentThemeIcon = computed(() => {
    switch (this.themeService.theme()) {
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
    const currentIndex = themes.indexOf(this.themeService.theme());
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    this.themeService.setTheme(nextTheme);
  }

  async logout() {
    // await this.authStore.logout();
    await this.router.navigate(['/login']);
  }

  goToProfile() {
    // Implement profile navigation
    console.log('Navigate to profile');
  }
}
