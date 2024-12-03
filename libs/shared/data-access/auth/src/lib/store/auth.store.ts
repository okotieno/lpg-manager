import { signalStore, withMethods, withState } from '@ngrx/signals';
import {
  ILoginResponse,
  IMutationLoginWithPasswordArgs,
} from '@lpg-manager/types';
import { inject, resource, ResourceStatus } from '@angular/core';
import { ILoginWithPasswordGQL } from '../schemas/auth.generated';
import { lastValueFrom } from 'rxjs';

interface AuthState {
  loginResponse: ILoginResponse;
  loginWithPasswordParams: IMutationLoginWithPasswordArgs;
}

const initialState: AuthState = {
  loginWithPasswordParams: { email: '', password: '' },
  loginResponse: {
    accessToken: '',
    refreshToken: '',
    refreshTokenKey: '',
    user: null,
  },
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, loginWithPasswordGQL = inject(ILoginWithPasswordGQL)) => {
    const loginResource = resource({
      request: () => ({
        email: store.loginWithPasswordParams.email(),
        password: store.loginWithPasswordParams.email(),
      }),
      loader: (param) => {
        if (param.previous.status === ResourceStatus.Idle) {
          return Promise.resolve(undefined);
        }
        return lastValueFrom(loginWithPasswordGQL.mutate(param.request));
      },
    });
    const login = (params: { email: string; password: string }) => {
      loginResource.reload();
    };
    return { login };
  })
);
