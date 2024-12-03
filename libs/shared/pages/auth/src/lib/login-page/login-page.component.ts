import { Component, effect, inject, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonIcon,
  IonText,
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
  showPassword = false;

  loginForm = this.#fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
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
      console.log(this.loginForm.value);
    }
  }
}
