import { IsNotEmpty, IsNumber, IsUUID, IsString, IsOptional, IsArray, IsDateString, ValidateIf } from 'class-validator';
import { Exists } from '@lpg-manager/validators';
import { CatalogueModel, StationModel } from '@lpg-manager/db';
import { Type } from 'class-transformer';

export class CreateInventoryInputDto {
  @IsUUID()
  @IsNotEmpty()
  @Exists(CatalogueModel, 'id', {
    message: (validationArguments) =>
      `Catalogue with id ${validationArguments.value} not found`,
  })
  catalogueId!: string;

  @IsUUID()
  @IsNotEmpty()
  @Exists(StationModel, 'id', {
    message: (validationArguments) =>
      `Station with id ${validationArguments.value} not found`,
  })
  stationId!: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  batchNumber!: string;

  @IsString()
  @IsOptional()
  reason!: string;

  @IsDateString()
  @IsOptional()
  manufactureDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsArray()
  @IsString({ each: true })
  @ValidateIf((o) => o.serialNumbers !== undefined)
  @IsOptional()
  serialNumbers?: string[];
}
