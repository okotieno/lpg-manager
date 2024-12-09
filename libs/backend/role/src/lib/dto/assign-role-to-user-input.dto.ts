import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { RoleModel, UserModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { Type } from 'class-transformer';

class RoleDto {
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id  ${validationArguments.value}" not found`
  })
  id = '';
}

export class AssignRoleToUserInputDto {

  @IsInt()
  @IsNotEmpty()
  @Exists(UserModel, 'id', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`
  })
  userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)

  roles: RoleDto[] = [];

}
