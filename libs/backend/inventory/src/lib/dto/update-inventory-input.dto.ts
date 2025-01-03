import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RoleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateInventoryInputDto } from './create-inventory-input.dto';

export class UpdateInventoryInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id ${validationArguments.value} not found`,
  })
  id!: string;

  @ValidateNested()
  params!: CreateInventoryInputDto;
}
