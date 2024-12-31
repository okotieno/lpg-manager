import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TransporterModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';

export class CreateDriverInputDto {
  @IsUUID()
  @IsNotEmpty()
  @Exists(TransporterModel, 'id', {
    message: (validationArguments) =>
      `Transporter with id ${validationArguments.value} not found`,
  })
  transporterId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber!: string;

  @IsString()
  @IsNotEmpty()
  contactNumber!: string;
} 