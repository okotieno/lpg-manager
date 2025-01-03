import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RoleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateOrderInputDto } from './create-order-input.dto';

export class UpdateOrderInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id ${validationArguments.value} not found`,
  })
  id!: string;

  @ValidateNested()
  params!: CreateOrderInputDto;
}
