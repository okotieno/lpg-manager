import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCartInputDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

}
