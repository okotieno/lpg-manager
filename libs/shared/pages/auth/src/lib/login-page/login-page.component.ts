import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton, IonInput,
  IonItem,
  IonList
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
  ],
  templateUrl: './login-page.component.html',
  styles: [
    `
      :host {
        /*display: block;*/
        /*height: 100%;*/
      }
    `,
  ],
})
export class LoginPageComponent {
  readonly #fb = inject(FormBuilder);
  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.loginForm.valid) {
      // Handle login logic
      console.log(this.loginForm.value);
    }
  }
}
