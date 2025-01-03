import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionModel } from '@lpg-manager/db';

@Module({
  imports: [SequelizeModule.forFeature([PermissionModel])],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionServiceBackendModule {}
