import { IsNotEmpty } from 'class-validator';
import { RoleModel } from '@lpg-manager/db';
import { DoesntExist } from '@lpg-manager/validators';

export class CreateRoleInputDto {
  @IsNotEmpty()
  @DoesntExist(RoleModel, 'name', { isAdmin: false }, { message: 'Role already exists' })
  name = '';

}
