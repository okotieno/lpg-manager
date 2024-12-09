import { IsNotEmpty } from 'class-validator';
import { PermissionModel } from '@lpg-manager/db';
import { DoesntExist } from '@lpg-manager/validators';

export class CreatePermissionInputDto {
  @IsNotEmpty()
  @DoesntExist(PermissionModel, 'name', { message: 'Permission already exists' })
  name = '';

}
