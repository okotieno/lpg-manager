import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RoleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import {
  CreateBrandCatalogueDto,
  CreateBrandInputDto,
} from './create-brand-input.dto';

class UpdateBrandCatalogueDto extends CreateBrandCatalogueDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}

export class UpdateBrandInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Brand with id ${validationArguments.value} not found`
  })
  id!: string;

  @ValidateNested()
  params!: Omit<CreateBrandInputDto, 'catalogues'> & {
    catalogues?: UpdateBrandCatalogueDto[];
  };
}
