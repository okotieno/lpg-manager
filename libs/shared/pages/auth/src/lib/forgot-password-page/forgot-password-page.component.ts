import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lpg-forgot-password-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    RouterLink
  ],
  templateUrl: './forgot-password-page.component.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    p {
      color: var(--ion-color-medium);
      margin-bottom: 24px;
    }

    a {
      color: var(--ion-color-primary);
      text-decoration: none;
      font-size: 14px;
    }

    ion-button {
      margin-top: 24px;
    }
  `]
})
export class ForgotPasswordPageComponent {
  readonly #fb = inject(FormBuilder)
  forgotPasswordForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      // Handle password reset logic
      console.log(this.forgotPasswordForm.value);
    }
  }
}
