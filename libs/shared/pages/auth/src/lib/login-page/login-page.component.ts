import { Component, effect, inject, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonIcon,
  IonText,
  IonSpinner,
  IonToast,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@lpg-manager/auth-store';
import { IMutationLoginWithPasswordArgs } from '@lpg-manager/types';

@Component({
  selector: 'lpg-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonList,
    RouterLink,
    IonIcon,
    IonText,
    IonSpinner,
    IonToast,
  ],
  templateUrl: './login-page.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class LoginPageComponent {
  readonly #authStore = inject(AuthStore);
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);
  user = this.#authStore.loginResponse;
  isLoading = this.#authStore.isLoading;
  errorMessage = this.#authStore.errorMessage;
  showPassword = false;

  loginForm = this.#fb.nonNullable.group({
    email: ['admin@example.com', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required]],
  });

  isLoadingEffect = effect(() => {
    const isLoading = this.#authStore.isLoading();
    untracked(() => {
      if (isLoading) {
        this.loginForm.disable();
      } else {
        this.loginForm.enable();
      }
    });
  });

  userLoggedInEffect = effect(async () => {
    const userLoggedIn = this.#authStore.isLoggedIn();
    await untracked(async () => {
      if (userLoggedIn) {
        await this.#router.navigate(['/dashboard']);
      }
    });
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.#authStore.login(
        this.loginForm.value as IMutationLoginWithPasswordArgs
      );
    }
  }

  removeErrorMessage() {
    this.#authStore.removeErrorMessage();
  }
}
