import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActivityLogInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
