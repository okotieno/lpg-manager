import { InjectionToken } from '@angular/core';

export interface IEnvVariable {
  environment: string;
  production: boolean;
}
export const ENV_VARIABLES = new InjectionToken<IEnvVariable>('ENV_VARIABLES');
