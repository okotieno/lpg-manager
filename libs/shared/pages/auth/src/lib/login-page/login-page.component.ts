import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton, IonInput,
  IonItem,
  IonList,
  IonIcon
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

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
    IonIcon
  ],
  templateUrl: './login-page.component.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    ion-button[fill="clear"] {
      --padding-start: 0.5rem;
      --padding-end: 0.5rem;
      height: 100%;
    }

    ion-button[fill="clear"]::part(native) {
      padding: 0;
    }
  `]
})
export class LoginPageComponent {
  readonly #fb = inject(FormBuilder);
  showPassword = false;
  
  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}
