import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { RoleModel, StationModel, TransporterModel, UserModel } from '@lpg-manager/db';
import { DoesntExist, Exists } from '@lpg-manager/validators';
import { Type } from 'class-transformer';

class UserRoleDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id ${validationArguments.value}" not found`,
  })
  roleId!: string;

  @IsUUID()
  @IsOptional()
  @Exists(StationModel, 'id', {
    message: (validationArguments) =>
      `Station with id ${validationArguments.value}" not found`,
  })
  stationId?: string;

  @IsUUID()
  @IsOptional()
  @Exists(TransporterModel, 'id', {
    message: (validationArguments) =>
      `Transporter with id ${validationArguments.value}" not found`,
  })
  transporterId?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;
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
