import { InjectionToken } from '@angular/core';

export interface IEnvVariable {
  environment: string;
  production: boolean;
  googleClientId: string;
  backendUrl: string;
}
export const ENV_VARIABLES = new InjectionToken<IEnvVariable>('ENV_VARIABLES');
export const SHOW_SUCCESS_MESSAGE = 'show-success-message';
export const SHOW_ERROR_MESSAGE = 'show-error-message';
