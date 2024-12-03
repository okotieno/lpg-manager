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
  forgotPasswordForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log(this.forgotPasswordForm.value);
    }
  }
}
