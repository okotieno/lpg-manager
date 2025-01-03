import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { inject } from '@angular/core';
import { ENV_VARIABLES } from '@lpg-manager/injection-token';

export const provideSocialLogin = () => ({
  provide: 'SocialAuthServiceConfig',
  useFactory: () => {
    const googleClientId = inject(ENV_VARIABLES).googleClientId;
    return {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(googleClientId),
        },
      ],
      onError: (err) => {
        console.error(err);
      },
    } as SocialAuthServiceConfig;
  },
});
