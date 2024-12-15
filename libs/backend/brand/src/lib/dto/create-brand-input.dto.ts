import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PermissionModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { Type } from 'class-transformer';

class PermissionDto {
  @Exists(PermissionModel, 'id', {
    message: (validationArguments) =>
      `Permission with id ${validationArguments.value} not found`
  })
  id!: string;
}

export class CreateBrandInputDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[] = [];
}
