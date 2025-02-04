import { Component, computed, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPopover,
  IonRouterOutlet,
  IonRow,
  IonText,
  IonToolbar
} from '@ionic/angular/standalone';
import { ThemeService } from '@lpg-manager/theme-service';
import { Router } from '@angular/router';
import { AuthStore } from '@lpg-manager/auth-store';

interface AppLink {
  name: string;
  description: string;
  icon: string;
  url: string;
  color: string;
}

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
    IonList,
    IonItem,
    IonLabel,
    IonPopover,
    IonRow,
    IonText,
    IonGrid,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export default class DashboardComponent {
  #themeService = inject(ThemeService);
  #router = inject(Router);
  #authStore = inject(AuthStore);

  apps: AppLink[] = [
    {
      name: 'Admin Portal',
      description: 'System administration and user management',
      icon: 'users-gear',
      url: 'https://admin.lpg-manager.com',
      color: 'primary'
    },
    {
      name: 'Depot Portal',
      description: 'Manage depot operations and inventory',
      icon: 'warehouse',
      url: 'https://depot.lpg-manager.com',
      color: 'success'
    },
    {
      name: 'Dealer Portal',
      description: 'Order management and sales operations',
      icon: 'store',
      url: 'https://dealer.lpg-manager.com',
      color: 'warning'
    },
    {
      name: 'Driver Portal',
      description: 'Delivery management and tracking',
      icon: 'truck',
      url: 'https://driver.lpg-manager.com',
      color: 'tertiary'
    }
  ];

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

  openApp(url: string) {
    window.location.href = url;
  }
}
