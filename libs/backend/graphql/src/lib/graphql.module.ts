import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLFormattedError } from 'graphql/error';
import { JwtService } from '@nestjs/jwt';
import {
  DateTimeResolver,
  EmailAddressResolver,
  PositiveFloatResolver,
  PositiveIntResolver,
  URLResolver,
  UUIDResolver,
} from 'graphql-scalars';

@Module({
  providers: [JwtService],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      debug: process.env['LPG_ENVIRONMENT'] === 'development',
      driver: ApolloDriver,
      playground: process.env['LPG_ENVIRONMENT'] === 'development',
      typePaths: ['./**/*.graphql'],
      context: (ctx: Record<string, string>) => ctx,
      path: 'graphql',
      subscriptions: {
        'graphql-ws': {
          onConnect: async ({
            connectionParams,
            extra,
          }: {
            extra: unknown;
            connectionParams?: Record<string, unknown>;
          }) => {
            const extractToken = (authHeader: string): string | null => {
              if (!authHeader) return null;
              const parts = authHeader.split(' ');
              if (parts.length === 2 && parts[0] === 'Bearer') {
                return parts[1];
              }
              return null;
            };
            const authToken = extractToken(
              connectionParams?.['Authorization'] as string
            );
            if (!authToken) {
              throw new Error('Authorization token is required');
            }

            const jwtService = new JwtService({
              secret: String(process.env['LPG_JWT_SECRET']), // Ensure this matches your JWT config
            });

            const decodedUser = await jwtService.verifyAsync(authToken);

            if (!decodedUser) {
              throw new Error('Invalid token');
            }

            (extra as Record<string, unknown>)['user'] = {
              email: decodedUser.email,
              id: decodedUser.sub,
            };
          },
        },
      },
      formatError: (error: GraphQLFormattedError) => {
        return {
          message: error.message,
          path: error.path,
          extensions: {
            code: error.extensions?.['code'],
            originalError: error.extensions?.['originalError'],
          },
        };
      },
      resolvers: {
        DateTime: DateTimeResolver,
        EmailAddress: EmailAddressResolver,
        URL: URLResolver,
        UUID: UUIDResolver,
        PositiveInt: PositiveIntResolver,
        PositiveFloat: PositiveFloatResolver,
      },
    }),
  ],
})
export class GraphqlModule {}
