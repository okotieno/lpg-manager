import { Module } from '@nestjs/common';
import { RoleResolver } from './resolvers/role.resolver';
import { RoleServiceBackendModule } from '@lpg-manager/role-service';
import { RolePermissionAssignmentResolver } from './resolvers/role-permission-assignment.resolver';
import { PermissionServiceBackendModule } from '@lpg-manager/permission-service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleUserModel } from '@lpg-manager/db';

@Module({
  imports: [
    RoleServiceBackendModule,
    PermissionServiceBackendModule,
    SequelizeModule.forFeature([RoleUserModel])
  ],
  providers: [
    RoleResolver,
    RolePermissionAssignmentResolver
  ],
})
export class RoleModule {
}
