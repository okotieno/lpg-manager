import { Global, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DriverModel, RoleModel, RoleUserModel, UserModel } from '@lpg-manager/db';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([UserModel, RoleUserModel, RoleModel, DriverModel])],
  providers: [UserService],
  exports: [UserService],
})
export class UserServiceModule {}
