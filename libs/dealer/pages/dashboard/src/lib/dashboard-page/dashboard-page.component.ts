import { Component, computed, inject } from '@angular/core';
import {
  IonBadge,
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
  IonPopover, IonRouterOutlet,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { ThemeService } from '@lpg-manager/theme-service';
import { Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbStore } from '@lpg-manager/breadcrumb';
import { TitleCasePipe } from '@angular/common';
import { CartStore } from '@lpg-manager/cart-store';
import { AuthStore } from '@lpg-manager/auth-store';
import { FormsModule } from '@angular/forms';
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
    RouterLink,
    BreadcrumbComponent,
    IonRow,
    IonText,
    TitleCasePipe,
    IonBadge,
    IonSelect,
    IonSelectOption,
    FormsModule,
    NotificationBellComponent,
    IonRouterOutlet,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export default class DashboardComponent {
  #authStore = inject(AuthStore);
  #themeService = inject(ThemeService);
  #router = inject(Router);
  #breadcrumbStore = inject(BreadcrumbStore);
  #cartStore = inject(CartStore);
  cartItemsCount = this.#cartStore.cartItemsCount;

  pageTitle = this.#breadcrumbStore.pageTitle;
  userRoleStation = this.#authStore.userRoles;
  activeRole = this.#authStore.activeRole;

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
  updateActiveRole($event: CustomEvent) {
    this.#authStore.updateActiveRole($event.detail.value);
  }
}
