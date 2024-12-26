import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
  withProps,
} from '@ngrx/signals';
import { IMutationLoginWithPasswordArgs } from '@lpg-manager/types';
import {
  computed,
  effect,
  inject,
  Injector,
  resource,
  ResourceStatus,
  untracked,
} from '@angular/core';
import {
  ILoginWithPasswordGQL,
  ILoginWithPasswordMutation,
  ILoginWithPasswordMutationVariables,
  ILoginWithTokenGQL,
  ISendPasswordResetEmailGQL,
} from '../schemas/auth.generated';
import { catchError, EMPTY, lastValueFrom, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { MutationResult } from '@apollo/client';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';

interface AuthState {
  refreshTokenInput: string;
  loginResponse: ILoginWithPasswordMutation['loginWithPassword'];
  loginWithPasswordParams: IMutationLoginWithPasswordArgs;
  errorMessage?: string;
  passwordResetLinkEmailInput: string;
}

const initialState: AuthState = {
  refreshTokenInput: '',
  loginWithPasswordParams: { email: '', password: '' },
  loginResponse: {
    accessToken: '',
    refreshToken: '',
    refreshTokenKey: '',
    user: null,
  },
  errorMessage: undefined,
  passwordResetLinkEmailInput: '',
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    _loginWithTokenGQL: inject(ILoginWithTokenGQL),
    _loginWithPasswordGQL: inject(ILoginWithPasswordGQL),
    _sendPasswordResetEmailGQL: inject(ISendPasswordResetEmailGQL),
  })),
  withProps((store) => ({
    _loginResource: resource<
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
          store._loginWithPasswordGQL.mutate(param.request).pipe(
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
    }),
    _loginWithTokenResource: resource({
      request: () => ({
        refreshToken: store.refreshTokenInput(),
      }),
      loader: (param) => {
        console.log('hitting login with token', param.request);
        if (!param.request.refreshToken) {
          return Promise.resolve(undefined);
        }
        return lastValueFrom(
          store._loginWithTokenGQL
            .mutate({ token: param.request.refreshToken ?? '' })
            .pipe(
              tap((res) => {
                if (res.data?.loginWithToken)
                  patchState(store, {
                    loginResponse: res.data.loginWithToken,
                  });
              })
            )
        );
      },
    }),

    _sendPasswordResetLinkEmailResource: resource({
      request: () => ({
        email: store.passwordResetLinkEmailInput(),
      }),
      loader: (param) => {
        if (!param.request.email) {
          return Promise.resolve(undefined);
        }
        return lastValueFrom(
          store._sendPasswordResetEmailGQL
            .mutate(
              { email: param.request.email ?? '' },
              {
                context: {
                  [SHOW_SUCCESS_MESSAGE]: true,
                  [SHOW_ERROR_MESSAGE]: true,
                },
              }
            )
            .pipe(
              tap((res) => {
                if (res.data?.sendPasswordResetLinkEmail)
                  console.log(res.data?.sendPasswordResetLinkEmail);
              })
            )
        );
      },
    }),
  })),
  withComputed((store) => {
    const accessToken = computed(() => store.loginResponse()?.accessToken);
    const _refreshToken = computed(() => store.loginResponse()?.refreshToken);
    const isLoggedIn = computed(() => Number(accessToken()?.length) > 0);
    const isLoading = computed(() => store._loginResource?.isLoading());
    const user = computed(() => store.loginResponse()?.user);
    return { isLoggedIn, accessToken, _refreshToken, isLoading, user };
  }),
  withMethods((store) => {
    const removeErrorMessage = () => {
      patchState(store, { errorMessage: undefined });
    };

    const login = (params: { email: string; password: string }) => {
      patchState(store, {
        loginWithPasswordParams: {
          email: params.email,
          password: params.password,
        },
      });
      store._loginResource?.reload();
    };
    const sendResetLink = (params: { email: string }) => {
      if (params.email === store.passwordResetLinkEmailInput()) {
        store._sendPasswordResetLinkEmailResource.reload();
      } else {
        patchState(store, { passwordResetLinkEmailInput: params.email });
      }
    };
    const logout = async () => {
      await Preferences.remove({ key: 'refresh-token' });
      await Preferences.remove({ key: 'access-token' });
    };
    return { login, removeErrorMessage, logout, sendResetLink };
  }),
  withHooks((store, injector = inject(Injector)) => {
    const onInit = async () => {
      const { value: refreshTokenInput } = await Preferences.get({
        key: 'refresh-token',
      });
      if (refreshTokenInput) patchState(store, { refreshTokenInput });

      effect(
        async () => {
          const refreshToken = store._refreshToken();
          const accessToken = store.accessToken();
          await untracked(async () => {
            await Preferences.set({
              key: 'refresh-token',
              value: refreshToken ?? '',
            });
            await Preferences.set({
              key: 'access-token',
              value: accessToken ?? '',
            });
          });
        },
        { injector }
      );
    };

    return { onInit };
  })
);
