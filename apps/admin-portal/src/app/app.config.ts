import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideApollo } from 'apollo-angular';
import { provideHttpClient } from '@angular/common/http';
import { apolloConfig } from '@lpg-manager/apollo-config';
import { ENV_VARIABLES, IEnvVariable } from '@lpg-manager/injection-token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideIonicAngular({
      useSetInputAPI: true,
    }),
    provideHttpClient(),
    provideApollo(apolloConfig),
    {
      provide: ENV_VARIABLES,
      useValue: {
        environment: process.env['LPG_ENVIRONMENT'],
        backendUrl: process.env['LPG_BACKEND_URL'],
        googleClientId: process.env['LPG_GOOGLE_CLIENT_ID'],
        production:  process.env['LPG_ENVIRONMENT'] === 'production',
      } as IEnvVariable,
    }
  ],
};
