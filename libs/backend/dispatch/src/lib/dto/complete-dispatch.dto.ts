import { IsArray, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

enum DispatchStatus {
  DEPOT_TO_DRIVER_CONFIRMED = 'DEPOT_TO_DRIVER_CONFIRMED',
  DRIVER_FROM_DEPOT_CONFIRMED = 'DRIVER_FROM_DEPOT_CONFIRMED',
}

export class DealerToDriverConfirmDto {
  @IsNotEmpty()
  @IsUUID()
  dispatchId!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  scannedCanisters!: string[];

  @IsEnum(DispatchStatus)
  dispatchStatus!: DispatchStatus
}
