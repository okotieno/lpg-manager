import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RoleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateCatalogueInputDto } from './create-catalogue-input.dto';

export class UpdateCatalogueInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id ${validationArguments.value} not found`
  })
  id!: string;

  @ValidateNested()
  params!: CreateCatalogueInputDto;
}
