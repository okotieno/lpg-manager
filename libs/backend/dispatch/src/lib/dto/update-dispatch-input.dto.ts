import { IsNotEmpty, IsString, ValidateNested, } from 'class-validator';
import { DispatchModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateDispatchInputDto } from './create-dispatch-input.dto';

export class UpdateDispatchInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(DispatchModel, 'id', {
    message: (validationArguments) =>
      `Dispatch with id ${validationArguments.value} not found`
  })
  id!: string;

  @ValidateNested()
  params!: CreateDispatchInputDto
}
