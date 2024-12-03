import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { catchError, filter, from, map, of, Subscription, switchMap, tap, timer } from 'rxjs';
import { ILoginResponse } from '@lpg-manager/types';
import {
  // IAuthUserAssignedWarehousesGQL,
  // IGoogleSignInGQL,
  // ILoginWithTokenGQL,
  // IRequestAccessTokenGQL
} from '../schemas/auth.generated';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // googleSignInGQL = inject(IGoogleSignInGQL);
  // requestAccessTokenGQL = inject(IRequestAccessTokenGQL);
  // loginWithTokenGQL = inject(ILoginWithTokenGQL);
  // authUserAssignedWarehousesGQL = inject(IAuthUserAssignedWarehousesGQL);
  refreshTokenTimeInterval = computed(() => {
    let refreshTimeInterval = 60000;
    if (this.accessToken().length > 0) {
      const tokenDetails = JSON.parse(atob((this.accessToken() ?? '').split('.')[1]));
      if (tokenDetails) {
        refreshTimeInterval = tokenDetails.exp * 1000 - new Date().getTime() - 4000;
      }
    }
    return refreshTimeInterval;
  });
  loggedIn = computed(() => this.accessToken().length > 0);
  private refreshTokenKey = 'refresh-token-key';
  refreshTokenChangedEffect = effect(async () => {
    const refreshToken = this.refreshToken() ?? '';
    if (this.refreshToken().length > 2) {
      await Preferences.set({
        key: this.refreshTokenKey,
        value: refreshToken
      });
      // this.startRefreshTokenPolling();
    }

  });
  private refreshTokenTimerSub?: Subscription;
  private loginDetails = signal<ILoginResponse>({ accessToken: '', refreshToken: '', refreshTokenKey: '' });
  user = computed(() => this.loginDetails().user);
  accessToken = computed(() => this.loginDetails().accessToken);
  refreshToken = computed(() => this.loginDetails().refreshToken);
  // authState$ = inject(SocialAuthService).authState.pipe(
  //   switchMap((user) =>
  //     // this.googleSignInGQL.mutate({ token: user.idToken })
  //   ),
  //   tap((loginDetailsResponse) => {
  //     if (loginDetailsResponse.data?.signInWithGoogle) {
  //       this.loginDetails.set(loginDetailsResponse.data.signInWithGoogle);
  //     }
  //   }),
  //   map(() => this.loggedIn())
  // );

  // getAccessTokenFromRefreshToken() {
  //   return this.requestAccessTokenGQL.mutate({ refreshToken: this.refreshToken() }).pipe(
  //     map(res => res.data?.requestAccessToken?.accessToken ?? '')
  //   );
  // }

  logout() {
    this.loginDetails.set({ accessToken: '', refreshToken: '', refreshTokenKey: '' });
  }

  // userLoaded() {
  //   return from(Preferences.get({
  //     key: this.refreshTokenKey
  //   })).pipe(
  //     switchMap(({ value: token }) => {
  //       if (this.loggedIn()) return [true];
  //
  //       if (token && token.length > 0) {
  //         return this.loginWithTokenGQL.mutate({ token }).pipe(
  //           map(({ data }) => data?.loginWithToken),
  //           tap((res) => {
  //             if (res) {
  //               this.loginDetails.set(res);
  //             }
  //           }),
  //           catchError((res) => {
  //             if (res.graphQLErrors?.[0]?.extensions?.originalError?.statusCode) {
  //               this.logout();
  //             }
  //             return of(false);
  //           }),
  //           map(() => true)
  //         );
  //       }
  //       return [true];
  //     })
  //   );
  // }

  // private startRefreshTokenPolling() {
  //   // this.connectRefreshTokenGateway(this.refreshToken(), refreshTokenKey);
  //   if (this.refreshTokenTimerSub) {
  //     this.refreshTokenTimerSub.unsubscribe();
  //   }
  //   this.refreshTokenTimerSub = timer(this.refreshTokenTimeInterval(), this.refreshTokenTimeInterval()).pipe(
  //     filter(() => this.refreshToken().length > 0),
  //     switchMap(() => this.getAccessTokenFromRefreshToken()),
  //     filter((accessToken) => accessToken.length > 0),
  //     tap((accessToken) => {
  //       this.loginDetails.set({ ...this.loginDetails(), accessToken });
  //     })
  //   ).subscribe();
  // }

  // getUseAssignedWarehouses() {
  //   return this.authUserAssignedWarehousesGQL.fetch().pipe(
  //     map((m) => m.data.authUserAssignedWarehouses.items)
  //   );
  // }
}
