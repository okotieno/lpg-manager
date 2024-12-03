import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-reset-password-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList
  ],
  templateUrl: './reset-password-page.component.html',
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

    ion-button {
      margin-top: 24px;
    }
  `]
})
export class ResetPasswordPageComponent {
  readonly #fb = inject(FormBuilder);
  resetPasswordForm = this.#fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });


  onSubmit() {
    if (this.resetPasswordForm.valid) {
      // Handle password reset logic
      console.log(this.resetPasswordForm.value);
    }
  }
}
