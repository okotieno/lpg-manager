import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DealerToDriverConfirmDto {
  @IsNotEmpty()
  @IsUUID()
  dispatchId!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  scannedCanisters!: string[];
}
