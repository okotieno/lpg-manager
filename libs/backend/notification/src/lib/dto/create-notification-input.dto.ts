import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationInputDto {
  @IsString()
  @IsNotEmpty()
  title = '';

  @IsString()
  @IsNotEmpty()
  description = '';
}
