import {
  IsArray,
  IsEnum,
  IsNotEmpty, IsOptional,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { DriverInventoryModel } from '@lpg-manager/db';
import { Exists } from '@lpg-manager/validators';
import { Type } from 'class-transformer';

enum DispatchStatus {
  DEPOT_TO_DRIVER_CONFIRMED = 'DEPOT_TO_DRIVER_CONFIRMED',
  DRIVER_FROM_DEPOT_CONFIRMED = 'DRIVER_FROM_DEPOT_CONFIRMED',
  DEALER_FROM_DRIVER_CONFIRMED = 'DEALER_FROM_DRIVER_CONFIRMED',
  IN_TRANSIT = 'IN_TRANSIT',
}

enum DriverInventoryStatus {
  DEPOT_TO_DRIVER_CONFIRMED = 'DEPOT_TO_DRIVER_CONFIRMED',
  DRIVER_TO_DEALER_CONFIRMED = 'DRIVER_TO_DEALER_CONFIRMED',
  DEALER_FROM_DRIVER_CONFIRMED = 'DEALER_FROM_DRIVER_CONFIRMED',
}

export class DriverInventoryDto {
  @IsUUID()
  @Exists(DriverInventoryModel, 'id', {
    message: (validationArguments) =>
      `Driver inventory with id  ${validationArguments.value}" not found`,
  })
  id!: string;
}

export class ScanConfirmDto {
  @IsNotEmpty()
  @IsUUID()
  dispatchId!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  scannedCanisters: string[] = [];

  @IsEnum(DispatchStatus)
  dispatchStatus!: DispatchStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DriverInventoryDto)
  driverInventories: DriverInventoryDto[] = [];

  @IsOptional()
  @IsEnum(DriverInventoryStatus)
  driverInventoryStatus!: DriverInventoryStatus;
}
