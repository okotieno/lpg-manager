import { IsInt } from 'class-validator';
import { PermissionModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class DeletePermissionInputDto {
  @IsInt()
  @Exists(PermissionModel, 'id', {
    message: (validationArguments) =>
      `Permission with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
