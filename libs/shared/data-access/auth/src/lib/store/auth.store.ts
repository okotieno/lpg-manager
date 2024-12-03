import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  ILoginResponse,
  IMutationLoginWithPasswordArgs,
} from '@lpg-manager/types';
import {
  computed,
  effect,
  inject, Injector,
  resource,
  ResourceStatus,
  untracked
} from '@angular/core';
import {
  ILoginWithPasswordGQL,
  ILoginWithTokenGQL, IRequestAccessTokenGQL
} from '../schemas/auth.generated';
import { lastValueFrom, switchMap, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

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
    const _refreshToken = computed(() => store.loginResponse.refreshToken());
    const isLoggedIn = computed(() => accessToken().length > 0);
    return { isLoggedIn, accessToken, _refreshToken };
  }),
  withMethods(
    (
      store,
      loginWithPasswordGQL = inject(ILoginWithPasswordGQL),
      requestAccessTokenGQL = inject(IRequestAccessTokenGQL),
      loginWithTokenGQL = inject(ILoginWithTokenGQL)
    ) => {
      const loadLoggedInUserResource = resource({
        request: () => ({
          refreshToken: store._refreshToken(),
        }),
        loader: (param) => {
          return lastValueFrom(
            requestAccessTokenGQL.mutate(param.request).pipe(
              tap(async (res) => {
                await Preferences.set({ key: 'access-token', value: res.data?.requestAccessToken?.accessToken ?? '' });
              }),
              switchMap(accessToken => loginWithTokenGQL.mutate({ token: accessToken.data?.requestAccessToken?.accessToken ?? ''})),
              tap((res) => {
                if (res.data?.loginWithToken)
                  patchState(store, {
                    loginResponse: res.data.loginWithToken,
                  });
              })
            )
          );
        },
      });

      const _loadLoggedInUser = async () => {
        const { value: refreshToken } = await Preferences.get({
          key: 'refresh-token',
        });
        if (refreshToken)
          patchState(store, {
            loginResponse: {
              ...store.loginResponse(),
              refreshToken: refreshToken,
            },
          });
        setTimeout(() => {
          loadLoggedInUserResource.reload();
        }, 2000)
      };
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
      return { login, _loadLoggedInUser };
    }
  ),
  withHooks((store, injector = inject(Injector)) => {
    const onInit = async () => {
      await store._loadLoggedInUser();

      effect(
        async () => {
          const refreshToken = store._refreshToken();
          const accessToken = store.accessToken();
          await untracked(async () => {
            await Preferences.set({
              key: 'refresh-token',
              value: refreshToken,
            });
            await Preferences.set({ key: 'access-token', value: accessToken });
          });
        },
        { injector }
      );
    };

    return { onInit };
  })
);
