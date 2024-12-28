import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideApollo } from 'apollo-angular';
import { provideHttpClient } from '@angular/common/http';
import { apolloConfig } from '@lpg-manager/apollo-config';
import { ENV_VARIABLES, IEnvVariable } from '@lpg-manager/injection-token';
import { GET_ITEMS_INCLUDE_FIELDS } from '@lpg-manager/data-table';
import { provideAnimations } from '@angular/platform-browser/animations';

declare const process: {
  env: {
    ['LPG_ENVIRONMENT']: string;
    ['LPG_BACKEND_URL']: string;
    ['LPG_GOOGLE_CLIENT_ID']: string;
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes, withComponentInputBinding(), withHashLocation()),
    provideIonicAngular({
      useSetInputAPI: true,
    }),
    provideHttpClient(),
    provideApollo(apolloConfig),
    provideAnimations(),
    {
      provide: ENV_VARIABLES,
      useValue: {
        environment: process.env['LPG_ENVIRONMENT'],
        backendUrl: process.env['LPG_BACKEND_URL'],
        googleClientId: process.env['LPG_GOOGLE_CLIENT_ID'],
        production:  process.env['LPG_ENVIRONMENT'] === 'production',
      } as IEnvVariable,
    },
    {
      provide: GET_ITEMS_INCLUDE_FIELDS,
      useValue: {},
    },
  ],
};
