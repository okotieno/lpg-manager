import { IsInt } from 'class-validator';
import { DriverModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class DeleteDriverInputDto {
  @IsInt()
  @Exists(DriverModel, 'id', {
    message: (validationArguments) =>
      `Driver with id ${validationArguments.value} not found`,
  })
  id = 0;
} 