import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSettingInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
