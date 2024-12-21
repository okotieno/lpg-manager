import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Exists } from '@lpg-manager/validators';
import { FileUploadModel } from '@lpg-manager/db';
import { Type } from 'class-transformer';

class FileUploadDto {
  @Exists(FileUploadModel, 'id', {
    message: (validationArguments) =>
      `File with id ${validationArguments.value} not found`
  })
  id!: string;
}

export class CreateBrandCatalogueDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  pricePerUnit?: number;

  @IsString()
  @IsNotEmpty()
  unit!: 'KG' | 'LITRE';

  @IsNotEmpty()
  quantityPerUnit!: number;
}

export class CreateBrandInputDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  companyName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileUploadDto)
  images: FileUploadDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBrandCatalogueDto)
  @IsOptional()
  catalogues?: CreateBrandCatalogueDto[];
}
