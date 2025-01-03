import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { VehicleModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateVehicleInputDto } from './create-vehicle-input.dto';

export class UpdateVehicleInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(VehicleModel, 'id', {
    message: (validationArguments) =>
      `Vehicle with id ${validationArguments.value} not found`,
  })
  id!: string;

  @ValidateNested()
  params!: CreateVehicleInputDto;
}
