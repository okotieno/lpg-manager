import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Exists } from '@lpg-manager/validators';
import { InventoryModel } from '@lpg-manager/db';

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartCatalogueInput)
  items!: CartCatalogueInput[];
}
