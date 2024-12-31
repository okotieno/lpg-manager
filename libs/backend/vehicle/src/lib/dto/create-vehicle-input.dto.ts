import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { TransporterModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class CreateVehicleInputDto {
  @IsUUID()
  @IsNotEmpty()
  @Exists(TransporterModel, 'id', {
    message: (validationArguments) =>
      `Transporter with id ${validationArguments.value} not found`,
  })
  transporterId!: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber!: string;

  @IsNumber()
  @IsNotEmpty()
  capacity!: number;

  @IsString()
  @IsNotEmpty()
  type!: string;
} 