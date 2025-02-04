import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { apolloConfig } from '@lpg-manager/apollo-config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ENV_VARIABLES, IEnvVariable } from '@lpg-manager/injection-token';

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
        production: process.env['LPG_ENVIRONMENT'] === 'production',
      } as IEnvVariable,
    },
  ],
};
