import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { IPermissionEnum } from '@lpg-manager/types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly i18n: I18nService
  ) {
    console.log('Permission Guard Called...')
  }

  canActivate(context: ExecutionContext): boolean {
    console.log('Reached 1');
    const requiredRoles = this.reflector.getAllAndOverride<IPermissionEnum[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    console.log('Reached 2', requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    console.log('Reached 3', user);

    const userHasPermission = requiredRoles.some((permission) =>
      user.permissions?.includes(permission)
    );

    console.log('Reached 4', userHasPermission);

    if (!userHasPermission) {
      console.log('Reached 5');
      throw new UnauthorizedException(
        this.i18n.t('alert.notAuthorised', {
          lang: I18nContext.current()?.lang,
        })
      );
    }

    console.log('Reached 6');

    return true;
  }
}
