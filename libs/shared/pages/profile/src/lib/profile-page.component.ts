import { Component, inject } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AuthStore } from '@lpg-manager/auth-store';

@Component({
  standalone: true,
  imports: [
    IonText,
    TitleCasePipe,
    DatePipe,
    IonIcon,
    IonRow,
    IonGrid,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  private authStore = inject(AuthStore);
  user = this.authStore.user;

  hasRoles() {
    return this.user()?.roles && Number(this.user()?.roles?.length) > 0;
  }
}
