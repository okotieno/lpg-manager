import { IsInt } from 'class-validator';
import { RoleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class DeleteCartInputDto {
  @IsInt()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
