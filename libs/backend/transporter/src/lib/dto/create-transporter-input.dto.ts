import { IsNotEmpty, IsString } from 'class-validator';

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
} 