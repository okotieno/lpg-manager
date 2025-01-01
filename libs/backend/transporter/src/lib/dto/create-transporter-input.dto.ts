import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class DriverInput {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber!: string;

  @IsString()
  @IsNotEmpty()
  contactNumber!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;
}

class VehicleInput {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

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

export class CreateTransporterInputDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  contactPerson!: string;

  @IsString()
  @IsNotEmpty()
  contactNumber!: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DriverInput)
  drivers?: DriverInput[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VehicleInput)
  vehicles?: VehicleInput[];
}
