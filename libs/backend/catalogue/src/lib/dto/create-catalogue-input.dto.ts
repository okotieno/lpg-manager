import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogueInputDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
