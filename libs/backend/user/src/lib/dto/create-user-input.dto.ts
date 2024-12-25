import { IsArray, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { RoleModel, UserModel } from '@lpg-manager/db';
import { DoesntExist, Exists } from '@lpg-manager/validators';
import { Type } from 'class-transformer';

class UserRoleDto {

  @IsUUID()
  id!: string;

  @IsUUID()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id ${validationArguments.value}" not found`
  })
  roleId!: string;

  @IsUUID()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Station with id ${validationArguments.value}" not found`
  })
  stationId!: string;
}

export class CreateUserInputDto {

  @IsString()
  @IsNotEmpty()
  firstName = '';

  @IsString()
  @IsNotEmpty()
  lastName = '';

  @IsNotEmpty()
  @IsEmail()
  @DoesntExist(UserModel, 'email', {isAdmin: false}, {message: 'Email already taken'})
  email = '';

  @IsPhoneNumber('KE')
  @DoesntExist(UserModel, 'phone', {isAdmin: true}, {message: 'Phone already taken'})
  phone = '';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserRoleDto)
  roles!: UserRoleDto[];
}
