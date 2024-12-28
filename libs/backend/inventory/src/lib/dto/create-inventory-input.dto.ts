import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Exists } from '@lpg-manager/validators';
import { CatalogueModel, StationModel } from '@lpg-manager/db';

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
  quantity!: number;
}
