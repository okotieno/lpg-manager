import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { isMobileEnvironmentUserAgentPresent } from '@lpg-manager/util';

export const CurrentDeviceType = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return isMobileEnvironmentUserAgentPresent(ctx.getContext().req)
      ? 'mobile'
      : 'web';
  }
);
