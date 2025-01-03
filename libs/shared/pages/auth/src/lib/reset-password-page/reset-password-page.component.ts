import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonText,
} from '@ionic/angular/standalone';
import { AuthStore } from '@lpg-manager/auth-store';

@Component({
  selector: 'lpg-reset-password-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonList,
    IonIcon,
    IonText,
  ],
  templateUrl: './reset-password-page.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class ResetPasswordPageComponent {
  passwordResetToken = input<string>();
  readonly #fb = inject(FormBuilder);
  readonly #authStore = inject(AuthStore);
  showPassword = false;

  resetPasswordForm = this.#fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirmation: ['', [Validators.required]],
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.#authStore.changePasswordUsingResetToken({
        token: this.passwordResetToken() as string,
        password: this.resetPasswordForm.value.password as string,
        passwordConfirmation: this.resetPasswordForm.value
          .passwordConfirmation as string,
      });
    }
  }
}
