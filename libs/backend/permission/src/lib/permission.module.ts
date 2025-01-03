import { Module } from '@nestjs/common';
import { PermissionResolver } from './resolvers/permission.resolver';
import { PermissionServiceBackendModule } from '@lpg-manager/permission-service';
import { RoleServiceBackendModule } from '@lpg-manager/role-service';

@Module({
  imports: [RoleServiceBackendModule, PermissionServiceBackendModule],
  providers: [PermissionResolver],
})
export class PermissionModule {}
