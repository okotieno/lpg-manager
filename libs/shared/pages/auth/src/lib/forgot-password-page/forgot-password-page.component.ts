import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonText
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@lpg-manager/auth-store';

@Component({
  selector: 'lpg-forgot-password-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonList,
    RouterLink,
    IonText
  ],
  templateUrl: './forgot-password-page.component.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class ForgotPasswordPageComponent {
  readonly #fb = inject(FormBuilder)
  readonly #authStore = inject(AuthStore);
  forgotPasswordForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.#authStore.sendResetLink({ email: this.forgotPasswordForm.value.email as string });
    }
  }
}
