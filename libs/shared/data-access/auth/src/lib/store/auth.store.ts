import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
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
  IChangePasswordUsingResetTokenGQL,
  IChangePasswordUsingResetTokenMutationVariables,
  ILoginWithPasswordGQL,
  ILoginWithPasswordMutation,
  ILoginWithPasswordMutationVariables,
  ILoginWithTokenGQL,
  ISendPasswordResetEmailGQL,
} from '../schemas/auth.generated';
import { catchError, EMPTY, lastValueFrom, of, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { MutationResult } from '@apollo/client';
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from '@lpg-manager/injection-token';
import { AuthState } from './auth.state';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IPermissionEnum } from '@lpg-manager/types';

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
  passwordResetParams: undefined,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(() => initialState),
  withProps(() => ({
    _alertCtrl: inject(AlertController),
    _router: inject(Router),
    _loginWithTokenGQL: inject(ILoginWithTokenGQL),
    _loginWithPasswordGQL: inject(ILoginWithPasswordGQL),
    _sendPasswordResetEmailGQL: inject(ISendPasswordResetEmailGQL),
    _changePasswordUsingResetTokenGQL: inject(
      IChangePasswordUsingResetTokenGQL
    ),
  })),
  withProps((store) => ({
    _changePasswordUsingResetToken: resource({
      request: () => ({
        params: store.passwordResetParams?.(),
      }),
      loader: ({ request, previous }) => {
        if (previous.status === ResourceStatus.Idle) {
          return Promise.resolve(undefined);
        }
        return lastValueFrom(
          store._changePasswordUsingResetTokenGQL.mutate(request.params).pipe(
            tap((res) => {
              if (res.data?.changePasswordUsingResetToken) {
                patchState(store, {
                  loginResponse: {
                    accessToken:
                      res.data.changePasswordUsingResetToken.accessToken,
                    refreshToken:
                      res.data.changePasswordUsingResetToken.refreshToken,
                    refreshTokenKey: '',
                    user: res.data.changePasswordUsingResetToken.user,
                  },
                });
              }
            }),
            catchError((err) => {
              patchState(store, {
                errorMessage: err.graphQLErrors[0].message,
              });
              return EMPTY;
            })
          )
        );
      },
    }),
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
    const isDealer = computed(() => {
      const _activeRole = activeRole();
      console.log(
        _activeRole?.role?.permissions?.find(
          (permission) => permission?.name === IPermissionEnum.AccessDealerApp
        )
      );
      if (!activeRole) return of(false);
      return;
      // return of(activeRole.role?.name.toLowerCase() === 'dealer');
    });
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
      isDealer,
    };
  }),
  withMethods((store) => {
    const changePasswordUsingResetToken = (
      passwordResetParams: IChangePasswordUsingResetTokenMutationVariables
    ) => {
      patchState(store, { passwordResetParams });
    };
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
      store._router.navigate(['/']);
    };

    const updateActiveRole = (activeRoleId: string) => {
      patchState(store, { activeRoleId });
    };

    const loadUserInfoGuard = async () => {
      if (store.isLoggedIn()) return true;

      const { value: token } = await Preferences.get({
        key: 'refresh-token',
      });
      if (!token) return true;
      const res = await lastValueFrom(
        store._loginWithTokenGQL.mutate({ token })
      );
      if (res.data?.loginWithToken)
        patchState(store, {
          loginResponse: res.data.loginWithToken,
        });
      return true;
    };

    const hasPermissionTo = (permissionName: IPermissionEnum) => {
      const permissions = store
        .userRoles()
        .flatMap((res) => res?.role?.permissions);
      return !!permissions.find(
        (permission) => permission?.name === permissionName
      );
    };

    return {
      login,
      removeErrorMessage,
      logout,
      sendResetLink,
      updateActiveRole,
      hasPermissionTo,
      changePasswordUsingResetToken,
      loadUserInfoGuard,
    };
  }),
  withHooks((store, injector = inject(Injector)) => {
    const onInit = async () => {
      const { value: activeRoleId } = await Preferences.get({
        key: 'active-role-id',
      });
      if (activeRoleId) patchState(store, { activeRoleId });

      effect(
        () => {
          const roles = store.userRoles();
          untracked(() => {

            if (roles.length > 0 && !store.activeRoleId()) {
              patchState(store, { activeRoleId: roles[0]?.id });
            }

            if (
              roles.length > 0 &&
              store.activeRoleId() &&
              !roles.map((role) => role?.id).includes(store.activeRoleId())
            ) {
              patchState(store, { activeRoleId: roles[0]?.id });
            }
          });
        },
        { injector }
      );

      effect(
        () => {
          const activeRoleId = store.activeRoleId();
          untracked(async () => {
            await Preferences.set({
              key: 'active-role-id',
              value: activeRoleId,
            });
          });
        },
        { injector }
      );

      effect(
        async () => {
          const refreshToken = store._refreshToken();
          const accessToken = store.accessToken();
          await untracked(async () => {
            if (refreshToken)
              await Preferences.set({
                key: 'refresh-token',
                value: refreshToken,
              });
            if (accessToken)
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
