import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  ILoginResponse,
  IMutationLoginWithPasswordArgs,
} from '@lpg-manager/types';
import { computed, inject, resource, ResourceStatus } from '@angular/core';
import { ILoginWithPasswordGQL } from '../schemas/auth.generated';
import { lastValueFrom, tap } from 'rxjs';

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
  withComputed((store) => {
    const accessToken = computed(() => store.loginResponse.accessToken());
    const isLoggedIn = computed(() => accessToken().length > 0);
    return { isLoggedIn, accessToken }
  }),
  withMethods((store, loginWithPasswordGQL = inject(ILoginWithPasswordGQL)) => {
    const loginResource = resource({
      request: () => ({
        email: store.loginWithPasswordParams.email(),
        password: store.loginWithPasswordParams.password(),
      }),
      loader: (param) => {
        if (param.previous.status === ResourceStatus.Idle) {
          return Promise.resolve(undefined);
        }
        return lastValueFrom(
          loginWithPasswordGQL.mutate(param.request).pipe(
            tap((res) => {
              if (res.data?.loginWithPassword)
                patchState(store, {
                  loginResponse: res.data.loginWithPassword,
                });
            })
          )
        );
      },
    });
    const login = (params: { email: string; password: string }) => {
      patchState(store, {
        loginWithPasswordParams: {
          email: params.email,
          password: params.password,
        },
      });
      loginResource.reload();
    };
    return { login };
  })
);
