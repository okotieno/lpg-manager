import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordChangeUsingTokenInputDto {
  @IsString()
  @IsNotEmpty()
  token = ''

  @IsString()
  @IsNotEmpty()
  password = ''

  @IsString()
  @IsNotEmpty()
  passwordConfirmation = ''
}
