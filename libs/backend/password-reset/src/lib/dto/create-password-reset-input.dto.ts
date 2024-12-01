import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePasswordResetInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
