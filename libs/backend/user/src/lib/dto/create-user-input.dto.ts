import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { UserModel } from '@lpg-manager/db';
import { DoesntExist } from '@lpg-manager/validators';

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
}
