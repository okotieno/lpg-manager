import { IsInt, ValidateNested } from 'class-validator';
import { CreatePermissionInputDto } from './create-permission-input.dto';
import { PermissionModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class UpdatePermissionInputDto {
  @IsInt()
  @Exists(PermissionModel, 'name', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`
  })
  id = 0;

  @ValidateNested()
  params: CreatePermissionInputDto = { name: '' };
}
