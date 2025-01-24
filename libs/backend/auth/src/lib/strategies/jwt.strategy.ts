import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@lpg-manager/user-service';
import Keyv from 'keyv';
import { isMobileEnvironmentUserAgentPresent } from '@lpg-manager/util';
import { FastifyRequest } from 'fastify';

interface JWTPayload {
  sessionId: string;
  email: string;
  sub: number;
  type: 'RefreshToken' | 'AuthToken';
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('JWT_SECRET') jwtSecret: string,
    private userService: UserService,
    @Inject('KEYV_REDIS') private readonly keyvRedis: Keyv,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: FastifyRequest, payload: JWTPayload) {
    console.log('JWT validate called');
    const permissions = await this.userService.getUserPermissions(
      payload.email,
    );
    const deviceType = isMobileEnvironmentUserAgentPresent(req)
      ? 'mobile'
      : 'web';

    console.log('JWT validate called 1', deviceType);
    const redisInfo = await this.keyvRedis.get(
      `session:${payload.sub}:${deviceType}`,
    );

    console.log('JWT validate called 2', redisInfo);
    if (!redisInfo || redisInfo !== payload.sessionId) {
      throw new UnauthorizedException(
        'This session is invalid, please try again.',
      );
    }

    console.log('JWT validate called 3', payload);

    if (payload.type === 'AuthToken') {
      return {
        id: payload.sub,
        username: payload.email,
        permissions: permissions.map(({ name }) => name),
      };
    }

    console.log('JWT validate called 4');
    return false;
  }
}
