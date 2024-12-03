import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonIcon,
  IonText
} from '@ionic/angular/standalone';

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
    IonText
  ],
  templateUrl: './reset-password-page.component.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class ResetPasswordPageComponent {
  readonly #fb = inject(FormBuilder);
  showPassword = false;
  
  resetPasswordForm = this.#fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value);
    }
  }
}
