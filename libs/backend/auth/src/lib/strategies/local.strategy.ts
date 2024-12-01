import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthServiceBackend } from '@lpg-manager/auth-service';
import { TranslationService } from '@lpg-manager/translation';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthServiceBackend,
    private translationService: TranslationService,
  ) {
    super();
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser({ email, password});
    if (!user) {
      throw new UnauthorizedException(this.translationService.getTranslation('alert.invalidLogin'));
    }
    return user;

  }
}
