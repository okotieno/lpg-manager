import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { AuthServiceBackend } from '@lpg-manager/auth-service';
import { UserModel } from '@lpg-manager/db';
import { UserService } from '@lpg-manager/user-service';
import {
  BadRequestException,
  Body,
  Inject,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterInputDto } from '../dto/register-input.dto';
import { LoginInputDto } from '../dto/login-input.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import {
  SEND_PASSWORD_RESET_LINK_QUEUE,
  SEND_PASSWORD_RESET_OTP_QUEUE,
  SEND_VERIFICATION_LINK_QUEUE,
} from '../constants/queue.constants';
import {
  OtpBackendService,
  OtpUsageEnum,
} from '@lpg-manager/otp-service';
import { TranslationService } from '@lpg-manager/translation';
import { ValidateOtpInputDto } from './validate-otp-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthEvent } from '../events/auth.event';
import { PasswordResetBackendService } from '@lpg-manager/password-reset-service';
import { PasswordChangeUsingTokenInputDto } from '../dto/password-change-using-token-input.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PUB_SUB } from '@lpg-manager/util';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CurrentDeviceType } from '../decorators/current-device.decorator';

@Resolver(() => UserModel)
export class AuthResolver {
  constructor(
    private authService: AuthServiceBackend,
    private userService: UserService,
    private otpService: OtpBackendService,
    private translationService: TranslationService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    @InjectQueue(SEND_PASSWORD_RESET_OTP_QUEUE)
    private readonly sendPasswordResetOtpQueue: Queue,
    @InjectQueue(SEND_PASSWORD_RESET_LINK_QUEUE)
    private readonly sendPasswordResetLinkQueue: Queue,
    @InjectQueue(SEND_VERIFICATION_LINK_QUEUE)
    private readonly sendVerificationLinkQueue: Queue,
    private eventEmitter: EventEmitter2,
    private readonly passwordResetService: PasswordResetBackendService,
  ) {}

  @Mutation()
  async signInWithGoogle(@Args('token') token: string) {
    const user = await this.authService.signInGoogleUser(token);
    if (!user) {
      return null;
    }
    return this.authService.login(user);
  }

  @Mutation()
  async signupGoogleUser(@Args('token') token: string) {
    const user = await this.authService.signupGoogleUser(token);
    return this.authService.login(user as UserModel);
  }

  @Mutation()
  async continueWithGoogle(
    @Args('token') token: string,
    @CurrentDeviceType() deviceType: 'web' | 'mobile',
  ) {
    const authenticatedUser =
      await this.authService.signInOrSignUpGoogleUser(token);
    if (!authenticatedUser?.user) {
      return null;
    }
    this.eventEmitter.emit(
      'auth.continue-with-google',
      new AuthEvent(authenticatedUser?.user),
    );
    if (authenticatedUser?.created) {
      this.eventEmitter.emit(
        'auth.registered',
        new AuthEvent(authenticatedUser?.user),
      );
      this.eventEmitter.emit(
        'auth.verified',
        new AuthEvent(authenticatedUser?.user),
      );
    }

    return this.authService.login(
      authenticatedUser.user as UserModel,
      deviceType,
    );
  }

  @Mutation()
  async requestAccessToken(
    @Args('refreshToken') refreshToken: string,
    @CurrentDeviceType() deviceType: 'web' | 'mobile',
  ) {
    const { email, userId, sessionId } =
      this.authService.validateToken(refreshToken);
    const user = await this.userService.findByEmail(email, { id: userId });
    return this.authService.login(user as UserModel, deviceType, sessionId);
  }

  @Mutation()
  async loginWithToken(@Args('token') token: string) {
    const { email, type } = this.authService.validateToken(token);
    if (type === 'RefreshToken') {
      const user = (await this.userService.findByEmail(email)) as UserModel;
      return this.authService.login(user as UserModel);
    }
    throw new UnauthorizedException('Invalid token');
  }

  @Mutation()
  async loginWithResetPasswordToken(@Args('token') token: string) {
    const { email } = this.authService.validateToken(token);
    const user = (await this.userService.findByEmail(email)) as UserModel;
    return this.authService.login(user as UserModel);
  }

  @Mutation()
  async register(
    @Body(new ValidationPipe()) registerInputDto: RegisterInputDto,
    @CurrentDeviceType() deviceType: 'web' | 'mobile',
  ) {
    const registeredUser = await this.authService.register(registerInputDto);

    this.eventEmitter.emit('auth.registered', new AuthEvent(registeredUser));

    return this.authService.login(registeredUser, deviceType);
  }

  @Mutation()
  @UseGuards(LocalAuthGuard)
  async loginWithPassword(
    @Body(new ValidationPipe()) loginInputDto: LoginInputDto,
    @CurrentDeviceType() deviceType: 'web' | 'mobile',
  ) {
    const user = await this.userService.findByEmail(loginInputDto.email);
    this.eventEmitter.emit('auth.login', new AuthEvent(user as UserModel));
    return this.authService.login(user, deviceType);
  }

  @Subscription('refreshedAccessToken', {
    resolve: (value) => value,
  })
  async refreshedAccessToken() {
    return this.pubSub.asyncIterator('refreshToken');
  }

  @Subscription('resetPasswordNotification', {
    resolve: (value) => value,
    filter(this: AuthResolver, payload, variables) {
      return payload.notificationKey === variables.notificationKey;
    },
  })
  async resetPasswordNotification() {
    return this.pubSub.asyncIterator('resetPasswordEmailSent');
  }

  @Mutation()
  async sendPasswordResetLinkEmail(@Args('email') email: string) {
    await this.sendPasswordResetLinkQueue.add({ email });
    return {
      success: true,
      message: this.translationService.getTranslation(
        'alert.resetPasswordLinkSentSuccess',
        { email },
      ),
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard)
  async sendVerificationLinkEmail(@CurrentUser() user: UserModel) {
    const dbUser = (await this.userService.findById(user.id)) as UserModel;
    if (dbUser.emailVerifiedAt) {
      throw new BadRequestException('Email is already verified');
    }
    await this.sendVerificationLinkQueue.add({ email: dbUser.email });
    return {
      success: true,
      message: this.translationService.getTranslation(
        'alert.verificationLinkSentSuccess',
        { email: dbUser.email ?? '' },
      ),
    };
  }

  @Mutation()
  async validatePasswordResetToken(@Body('token') token: string) {
    const { user } = await this.passwordResetService.validateToken(token);
    return { user };
  }

  @Mutation()
  async verifyEmail(@Body('token') token: string) {
    const user = await this.authService.verifyEmail(token);
    this.eventEmitter.emit('auth.verified', new AuthEvent(user));
    return {
      success: true,
      message: this.translationService.getTranslation(
        'alert.verifyEmailSuccess',
      ),
    };
  }

  @Mutation()
  async changePasswordUsingResetToken(
    @Body(new ValidationPipe()) input: PasswordChangeUsingTokenInputDto,
    @CurrentDeviceType() deviceType: 'web' | 'mobile',
  ) {
    if (input.password !== input.passwordConfirmation) {
      throw new BadRequestException(
        'Password confirmation must match password',
      );
    }
    const user = await this.passwordResetService.resetPassword(
      input.token,
      input.password,
    );
    return this.authService.login(user, deviceType);
  }

  @Mutation()
  async sendPasswordResetOtpEmail(@Args('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const otp = await this.otpService.generate({
        identifier: email,
        usage: OtpUsageEnum.PasswordReset,
        digits: 6,
        validity: 10,
      });
      await this.sendPasswordResetOtpQueue.add({
        email,
        otp: otp.token,
        firstName: user.firstName,
      });

      return {
        success: true,
        message: this.translationService.getTranslation(
          'alert.resetPasswordOTPSentSuccess',
        ),
      };
    } else {
      throw new NotFoundException(
        this.translationService.getTranslation('alert.emailNotFound'),
      );
    }
  }

  @Mutation()
  async validateOtp(
    @Body(new ValidationPipe()) validateOtpInput: ValidateOtpInputDto,
    @CurrentDeviceType() deviceType: 'web' | 'mobile',
  ) {
    const { identifier, token } = validateOtpInput;

    const validateOtp = await this.otpService.validate(
      identifier,
      token,
      OtpUsageEnum.PasswordReset,
    );

    if (!validateOtp.status) {
      throw new UnauthorizedException(validateOtp.message);
    }

    const user = await this.userService.findByUsernameEmailPhone(identifier);

    return this.authService.login(user as UserModel, deviceType);
  }

}
