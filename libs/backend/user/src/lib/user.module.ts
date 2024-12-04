import { Module } from '@nestjs/common';
import { UserResolver } from './resolvers/user.resolver';
import { UserServiceModule } from '@lpg-manager/user-service';
import { UserModelEventsListener } from './listerners/user-model-events-listener.service';
import { EmailModule } from '@lpg-manager/email-service';
import { RoleServiceBackendModule } from '@lpg-manager/role-service';
import { UserRolesResolver } from './resolvers/user-roles.resolver';

@Module({
  imports: [
    UserServiceModule,
    RoleServiceBackendModule,
    EmailModule
  ],
  providers: [
    UserResolver,
    UserRolesResolver,
    UserModelEventsListener
  ],
  exports: [],
})
export class UserModule {
}
