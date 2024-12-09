import { IsInt, ValidateNested } from 'class-validator';
import { CreateRoleInputDto } from './create-role-input.dto';
import { RoleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class UpdateRoleInputDto {
  @IsInt()
  @Exists(RoleModel, 'name', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`
  })
  id = 0;

  @ValidateNested()
  params: CreateRoleInputDto = { name: '' };
}
