import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
  withProps,
} from '@ngrx/signals';
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
import {
  catchError,
  EMPTY,
  filter,
  lastValueFrom,
  map,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { MutationResult } from '@apollo/client';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';
import { AuthState } from './auth.state';

const initialState: AuthState = {
  initialLoadComplete: false,
  activeRoleId: '',
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
  withState(() => initialState),
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
        if (!param.request.refreshToken) {
          return Promise.resolve(undefined);
        }
        return lastValueFrom(
          store._loginWithTokenGQL
            .mutate({ token: param.request.refreshToken ?? '' })
            .pipe(
              catchError((err) => {
                patchState(store, { initialLoadComplete: true });
                return throwError(() => err);
              }),
              tap((res) => {
                patchState(store, { initialLoadComplete: true });
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
          store._sendPasswordResetEmailGQL.mutate(
            { email: param.request.email ?? '' },
            {
              context: {
                [SHOW_SUCCESS_MESSAGE]: true,
                [SHOW_ERROR_MESSAGE]: true,
              },
            }
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
    const userRoles = computed(() => user()?.roles ?? []);
    const activeRole = computed(() =>
      userRoles().find((userRole) => userRole?.id === store.activeRoleId())
    );
    const activeStation = computed(() => activeRole()?.station);

    return {
      isLoggedIn,
      accessToken,
      _refreshToken,
      isLoading,
      user,
      userRoles,
      activeRole,
      activeStation,
    };
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
      patchState(store, {
        loginResponse: {
          accessToken: '',
          refreshToken: '',
          refreshTokenKey: '',
          user: null,
        },
      });
    };

    const updateActiveRole = (activeRoleId: string) => {
      patchState(store, { activeRoleId });
    };
    const isAuthenticatedGuard = () =>
      timer(100, 100).pipe(
        filter(() => store.initialLoadComplete()),
        map(() => store.isLoggedIn())
      );
    const isGuestGuard = () =>
      isAuthenticatedGuard().pipe(map((isAuthenticated) => !isAuthenticated));
    return {
      login,
      removeErrorMessage,
      logout,
      sendResetLink,
      updateActiveRole,
      isAuthenticatedGuard,
      isGuestGuard,
    };
  }),
  withHooks((store, injector = inject(Injector)) => {
    const onInit = async () => {
      const { value: refreshTokenInput } = await Preferences.get({
        key: 'refresh-token',
      });
      if (refreshTokenInput) patchState(store, { refreshTokenInput });
      else patchState(store, { initialLoadComplete: true });

      effect(
        () => {
          const roles = store.userRoles();
          untracked(() => {
            if (roles.length > 0) {
              patchState(store, { activeRoleId: roles[0]?.id });
            }
          });
        },
        { injector }
      );

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
