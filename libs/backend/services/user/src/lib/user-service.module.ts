import { Global, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleUserModel, UserModel } from '@lpg-manager/db';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([UserModel, RoleUserModel])],
  providers: [UserService],
  exports: [UserService],
})
export class UserServiceModule {}
