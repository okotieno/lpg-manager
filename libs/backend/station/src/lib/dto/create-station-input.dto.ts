import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Exists } from '@lpg-manager/validators';
import { FileUploadModel } from '@lpg-manager/db';
import { Type } from 'class-transformer';

class FileUploadDto {
  @Exists(FileUploadModel, 'id', {
    message: (validationArguments) =>
      `Permission with id ${validationArguments.value} not found`
  })
  id!: string;
}

export class CreateStationInputDto {
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
}
