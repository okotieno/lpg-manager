import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsInt,
} from 'class-validator';
import {
  CatalogueModel,
  DriverInventoryModel,
  InventoryItemModel,
  StationModel,
} from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { Type } from 'class-transformer';
import { IScanAction } from '@lpg-manager/types';

class DriverInventoryDto {
  @IsUUID()
  @Exists(DriverInventoryModel, 'id', {
    message: (validationArguments) =>
      `Driver inventory with id  ${validationArguments.value}" not found`,
  })
  id!: string;
}

class InventoryItemDto {
  @IsUUID()
  @Exists(InventoryItemModel, 'id', {
    message: (validationArguments) =>
      `Inventory with id  ${validationArguments.value}" not found`,
  })
  id!: string;
}

class CatalogueDto {
  @IsUUID()
  @Exists(CatalogueModel, 'id', {
    message: (validationArguments) =>
      `Catalogue with id  ${validationArguments.value}" not found`,
  })
  catalogueId!: string;

  @IsInt()
  quantity!: number;
}

class StationDto {
  @IsUUID()
  @Exists(StationModel, 'id', {
    message: (validationArguments) =>
      `Depot with id  ${validationArguments.value}" not found`,
  })
  id!: string;
}

export class ScanConfirmDto {
  @IsNotEmpty()
  @IsUUID()
  dispatchId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryItemDto)
  inventoryItems: InventoryItemDto[] = [];

  @IsEnum(IScanAction)
  scanAction!: IScanAction;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DriverInventoryDto)
  emptyCylinders: CatalogueDto[] = [];

  @IsOptional()
  @ValidateNested()
  @Type(() => StationDto)
  dealer?: StationDto;
}
