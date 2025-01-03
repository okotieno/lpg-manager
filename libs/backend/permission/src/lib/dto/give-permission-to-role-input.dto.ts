import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { PermissionModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { Type } from 'class-transformer';

class PermissionDto {
  @Exists(PermissionModel, 'id', {
    message: (validationArguments) =>
      `Permission with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}

export class GivePermissionToRoleInputDto {
  @IsNotEmpty()
  @Exists(PermissionModel, 'id', {
    message: (validationArguments) =>
      `Permission with id  ${validationArguments.value}" not found`
  })
  roleId = 0;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionModel)

  permissions: PermissionModel[] = [];

}
