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
  inject,
  Injector,
  resource,
  ResourceRef,
  ResourceStatus,
  untracked,
} from '@angular/core';
import {
  ILoginWithPasswordGQL,
  ILoginWithPasswordMutation,
  ILoginWithPasswordMutationVariables,
  ILoginWithTokenGQL,
  IRequestAccessTokenGQL,
} from '../schemas/auth.generated';
import { catchError, EMPTY, lastValueFrom, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { MutationResult } from '@apollo/client';

interface AuthState {
  loginResponse: ILoginResponse;
  loginWithPasswordParams: IMutationLoginWithPasswordArgs;
  loginResource?: ResourceRef<
    MutationResult<ILoginWithPasswordMutation> | undefined
  >;
  errorMessage?: string;
}

const initialState: AuthState = {
  loginWithPasswordParams: { email: '', password: '' },
  loginResponse: {
    accessToken: '',
    refreshToken: '',
    refreshTokenKey: '',
    user: null,
  },
  loginResource: undefined,
  errorMessage: undefined,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    const accessToken = computed(() => store.loginResponse.accessToken());
    const _refreshToken = computed(() => store.loginResponse.refreshToken());
    const isLoggedIn = computed(() => accessToken().length > 0);
    const isLoading = computed(() => store.loginResource?.()?.isLoading());
    return { isLoggedIn, accessToken, _refreshToken, isLoading };
  }),
  withMethods(
    (
      store,
      loginWithTokenGQL = inject(ILoginWithTokenGQL),
      loginWithPasswordGQL = inject(ILoginWithPasswordGQL)
    ) => {
      const removeErrorMessage = () => {
        patchState(store, { errorMessage: undefined });
      };
      const loginResource = resource<
        MutationResult<ILoginWithPasswordMutation> | undefined,
        ILoginWithPasswordMutationVariables
      >({
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
              }),
              catchError((err) => {
                patchState(store, {
                  errorMessage: err.graphQLErrors[0].message,
                });
                return EMPTY;
              })
            )
          ) as Promise<MutationResult<ILoginWithPasswordMutation> | undefined>;
        },
      });
      patchState(store, { loginResource });
      const loginWithTokenResource = resource({
        request: () => ({
          refreshToken: store._refreshToken(),
        }),
        loader: (param) => {
          if (param.previous.status === ResourceStatus.Idle) {
            return Promise.resolve(undefined);
          }
          return lastValueFrom(
            loginWithTokenGQL
              .mutate({
                token: param.request.refreshToken ?? '',
              })
              .pipe(
                tap((res) => {
                  if (res.data?.loginWithToken)
                    patchState(store, {
                      loginResponse: res.data.loginWithToken,
                    });
                  loginWithTokenResource.destroy();
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
      };

      const login = (params: { email: string; password: string }) => {
        patchState(store, {
          loginWithPasswordParams: {
            email: params.email,
            password: params.password,
          },
        });
        loginResource?.reload();
      };
      return { login, _loadLoggedInUser, removeErrorMessage };
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
            await Preferences.set({
              key: 'access-token',
              value: accessToken,
            });
          });
        },
        { injector }
      );
    };

    return { onInit };
  })
);
