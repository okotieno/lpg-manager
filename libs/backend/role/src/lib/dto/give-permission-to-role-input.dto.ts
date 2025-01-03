import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { PermissionModel, RoleModel } from '@lpg-manager/db';
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
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id  ${validationArguments.value}" not found`
  })
  roleId = '';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)

  permissions: PermissionModel[] = [];

}
