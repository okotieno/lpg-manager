import { Module } from '@nestjs/common';
import { RoleResolver } from './resolvers/role.resolver';
import { RoleServiceBackendModule } from '@lpg-manager/role-service';
import { RolePermissionAssignmentResolver } from './resolvers/role-permission-assignment.resolver';
import { PermissionServiceBackendModule } from '@lpg-manager/permission-service';
import { UserServiceModule } from '@lpg-manager/user-service';

@Module({
  imports: [
    RoleServiceBackendModule,
    PermissionServiceBackendModule,
    UserServiceModule
  ],
  providers: [
    RoleResolver,
    RolePermissionAssignmentResolver
  ],
})
export class RoleModule {
}
