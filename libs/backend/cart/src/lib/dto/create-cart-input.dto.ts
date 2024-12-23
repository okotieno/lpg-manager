import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartCatalogueInput {
  @IsString()
  catalogueId!: string;

  @IsNumber()
  quantity!: number;
}

export class CreateCartInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartCatalogueInput)
  items!: CartCatalogueInput[];
}
