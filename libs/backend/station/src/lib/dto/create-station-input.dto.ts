import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Exists } from '@lpg-manager/validators';
import { BrandModel } from '@lpg-manager/db';

class BrandDto {
  @Exists(BrandModel, 'id', {
    message: (validationArguments) =>
      `Brand with id ${validationArguments.value}" not found`,
  })
  id!: string;
}

enum StationType {
  'DEPOT' = 'DEPOT',
  'DEALER' = 'DEALER',
}

export class CreateStationInputDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(StationType)
  @IsNotEmpty()
  type!: 'DEPOT' | 'DEALER';

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BrandDto)
  brands!: BrandDto[];
}
