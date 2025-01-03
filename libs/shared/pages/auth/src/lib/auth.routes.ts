import { Routes } from '@angular/router';
import { AuthPageComponent } from './auth-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ForgotPasswordPageComponent } from './forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordPageComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordPageComponent,
      },
      {
        path: 'reset-password/:passwordResetToken',
        component: ResetPasswordPageComponent,
      },
    ],
  },
];
