import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { DoesntExist } from '@lpg-manager/validators';
import { UserModel } from '@lpg-manager/db';

export class RegisterInputDto {
  @IsString()
  @IsNotEmpty()
  firstName = '';

  @IsString()
  @IsNotEmpty()
  lastName = '';

  @IsNotEmpty()
  password = '';

  @IsNotEmpty()
  passwordConfirmation = '';

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @DoesntExist(UserModel, 'email')
  email = '';
}
