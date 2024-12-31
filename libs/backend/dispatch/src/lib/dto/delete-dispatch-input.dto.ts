import { IsInt } from 'class-validator';
import { DispatchModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class DeleteDispatchInputDto {
  @IsInt()
  @Exists(DispatchModel, 'id', {
    message: (validationArguments) =>
      `Dispatch with id ${validationArguments.value} not found`,
  })
  id = 0;
} 