import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RoleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateBrandInputDto } from './create-brand-input.dto';

export class UpdateBrandInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id ${validationArguments.value} not found`
  })
  id!: string;

  @ValidateNested()
  params!: CreateBrandInputDto;
}
