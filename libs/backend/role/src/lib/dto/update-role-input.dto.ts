import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RoleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateRoleInputDto } from './create-role-input.dto';

export class UpdateRoleInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id ${validationArguments.value} not found`,
  })
  id!: string;

  @ValidateNested()
  params!: CreateRoleInputDto;
}
