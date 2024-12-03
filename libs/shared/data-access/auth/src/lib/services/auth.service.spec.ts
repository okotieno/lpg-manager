import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import {
  IAuthUserAssignedWarehousesGQL,
  IGoogleSignInGQL,
  ILoginWithTokenGQL,
  IRequestAccessTokenGQL
} from '../schemas/auth.generated';
import { SocialAuthService } from '@abacritt/angularx-social-login';

const mockSocialAuthService = {
  authState: of({ idToken: 'someToken' }) // Mocking authState observable
};

const mockGoogleSignInGQL = {
  mutate: jest.fn().mockReturnValue(of({ data: { signInWithGoogle: { user: {} } } }))
};


const mockRequestAccessTokenService = {
  mutate: jest.fn().mockReturnValue(of({ data: { requestAccessToken: { accessToken: 'SomeToken' } } }))
};

const mockLoginWithTokenService = {
  mutate: jest.fn().mockReturnValue(of({ data: { loginWithToken: { user: {} } } }))
};
const mockAuthUserAssignedWarehousesGQL = {
  mutate: jest.fn().mockReturnValue(of({ data: { authUserAssignedWarehouses: { items: [] } } }))
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: SocialAuthService, useValue: mockSocialAuthService },
        { provide: IRequestAccessTokenGQL, useValue: mockRequestAccessTokenService },
        { provide: ILoginWithTokenGQL, useValue: mockLoginWithTokenService },
        { provide: IGoogleSignInGQL, useValue: mockGoogleSignInGQL },
        { provide: IGoogleSignInGQL, useValue: mockGoogleSignInGQL },
        { provide: IAuthUserAssignedWarehousesGQL, useValue: mockAuthUserAssignedWarehousesGQL },
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should call googleSignInGQL with token from authState$', () => {
    service.authState$.subscribe(() => {
      expect(mockGoogleSignInGQL.mutate).toHaveBeenCalledWith({ token: 'someToken' });
    });
  });
});
