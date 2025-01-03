import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { DriverModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { CreateDriverInputDto } from './create-driver-input.dto';

export class UpdateDriverInputDto {
  @IsString()
  @IsNotEmpty()
  @Exists(DriverModel, 'id', {
    message: (validationArguments) =>
      `Driver with id ${validationArguments.value} not found`,
  })
  id!: string;

  @ValidateNested()
  params!: CreateDriverInputDto;

  @IsArray()
  @IsOptional()
  @IsUUID(undefined, { each: true })
  vehicles?: string[];
}
