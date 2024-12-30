import { ILoginWithPasswordMutation } from '../schemas/auth.generated';
import { IMutationLoginWithPasswordArgs } from '@lpg-manager/types';

export interface AuthState {
  activeRoleId: string;
  refreshTokenInput: string;
  loginResponse: ILoginWithPasswordMutation['loginWithPassword'];
  loginWithPasswordParams: IMutationLoginWithPasswordArgs;
  errorMessage?: string;
  passwordResetLinkEmailInput: string;
  initialLoadComplete: boolean;
}
