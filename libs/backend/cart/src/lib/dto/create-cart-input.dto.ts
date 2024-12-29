import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartCatalogueInput {
  @IsString()
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
