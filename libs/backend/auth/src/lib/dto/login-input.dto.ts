import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInputDto {
  @IsString()
  @IsNotEmpty()
  email = '';

  @IsString()
  @IsNotEmpty()
  password = '';
}
