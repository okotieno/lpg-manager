import { IsInt } from 'class-validator';
import { VehicleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class DeleteVehicleInputDto {
  @IsInt()
  @Exists(VehicleModel, 'id', {
    message: (validationArguments) =>
      `Vehicle with id ${validationArguments.value} not found`,
  })
  id = 0;
} 