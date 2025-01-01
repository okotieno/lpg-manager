import { IsNotEmpty, IsString, IsUUID, IsEmail, IsArray, IsOptional } from 'class-validator';
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
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsArray()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  vehicles?: string[];
}
