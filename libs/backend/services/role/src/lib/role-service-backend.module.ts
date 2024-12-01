import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleModel, RoleUserModel } from '@lpg-manager/db';

@Module({
  imports: [
    SequelizeModule.forFeature([RoleModel, RoleUserModel])
  ],
  providers: [
    RoleService
  ],
  exports: [
    RoleService
  ],
})
export class RoleServiceBackendModule {}
