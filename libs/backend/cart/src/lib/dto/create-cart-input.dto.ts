import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Exists } from '@lpg-manager/validators';
import { InventoryModel, StationModel } from '@lpg-manager/db';

class CartCatalogueInput {
  @IsUUID()
  @Exists(InventoryModel, 'id', {
    message: (validationArguments) =>
      `Inventory with id  ${validationArguments.value}" not found`,
  })
  inventoryId!: string;

  @IsNumber()
  quantity!: number;
}

export class CreateCartInputDto {
  @Exists(StationModel, 'id', {
    message: (validationArguments) =>
      `Station with id  ${validationArguments.value}" not found`,
  })
  dealerId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartCatalogueInput)
  items!: CartCatalogueInput[];
}
